import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Helmet } from 'react-helmet-async';
import { BarChart3, Globe, Smartphone, Monitor, MousePointerClick } from 'lucide-react';

interface ClickEvent {
  id: number;
  short_code: string;
  referrer: string | null;
  user_agent: string | null;
  country: string | null;
  city: string | null;
  device: string | null;
  is_qr: boolean;
  created_at: string;
}

export default function Stats() {
  const { code } = useParams<{ code: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<{ original_url: string; clicks: number } | null>(null);
  const [events, setEvents] = useState<ClickEvent[]>([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!code) return;
      setLoading(true);
      setError(null);
      try {
        const { data: linkRows, error: linkErr } = await supabase
          .from('links')
          .select('original_url,clicks')
          .eq('short_code', code)
          .limit(1);
        if (linkErr) throw linkErr;
        if (!linkRows || linkRows.length === 0) {
          setError('Link not found');
          setLoading(false);
          return;
        }
        if (!active) return;
        setLink({ original_url: linkRows[0].original_url, clicks: linkRows[0].clicks ?? 0 });

        // Fetch last 1000 events for this code
        const { data: evts, error: evtErr } = await supabase
          .from('click_events')
          .select('*')
          .eq('short_code', code)
          .order('created_at', { ascending: false })
          .range(0, 999);
        if (evtErr) throw evtErr;
        if (!active) return;
        setEvents(evts || []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load stats');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [code]);

  const aggregates = useMemo(() => {
    const byCountry: Record<string, number> = {};
    const byDevice: Record<string, number> = {};
    const byReferrer: Record<string, number> = {};
    const byDay: Record<string, number> = {};
    let qrClicks = 0;

    for (const e of events) {
      if (e.is_qr) qrClicks += 1;
      const c = (e.country || 'Unknown').toUpperCase();
      byCountry[c] = (byCountry[c] || 0) + 1;
      const d = e.device || 'unknown';
      byDevice[d] = (byDevice[d] || 0) + 1;
      const r = e.referrer ? new URL(e.referrer).hostname.replace('www.', '') : 'Direct';
      byReferrer[r] = (byReferrer[r] || 0) + 1;
      const day = new Date(e.created_at).toISOString().slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
    }

    const top = (obj: Record<string, number>, n = 5) => Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n);

    return {
      totalEvents: events.length,
      qrClicks,
      byCountryTop: top(byCountry, 6),
      byDeviceTop: top(byDevice, 3),
      byReferrerTop: top(byReferrer, 6),
      byDay,
    };
  }, [events]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Analytics…</CardTitle>
            <CardDescription>Please wait while we fetch your stats.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-32 bg-gray-100 rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Stats Unavailable</CardTitle>
            <CardDescription>{error || 'Link not found'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/">Go back</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalClicks = link.clicks;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <Helmet>
        <title>Analytics for {code} | ShortenURL</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics for /{code}</h1>
        <p className="text-gray-600 break-all">
          Destination: <a className="text-blue-600 hover:underline" href={link.original_url} target="_blank" rel="noreferrer">{link.original_url}</a>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><MousePointerClick className="w-4 h-4"/> Total Clicks</CardTitle>
            <CardDescription>From link counter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalClicks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-4 h-4"/> Recorded Events</CardTitle>
            <CardDescription>Last 1000 events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{aggregates.totalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MousePointerClick className="w-4 h-4"/>
              QR Clicks
            </CardTitle>
            <CardDescription>Identified via ?qr=1</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{aggregates.qrClicks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Globe className="w-4 h-4"/> Top Country</CardTitle>
            <CardDescription>Where clicks originate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl">
              {aggregates.byCountryTop[0] ? `${aggregates.byCountryTop[0][0]} · ${aggregates.byCountryTop[0][1]}` : '—'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {aggregates.byCountryTop.map(([c, n]) => (
                <li key={c} className="flex justify-between"><span>{c}</span><span className="font-medium">{n}</span></li>
              ))}
              {aggregates.byCountryTop.length === 0 && <li className="text-gray-500">No data yet</li>}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {aggregates.byDeviceTop.map(([d, n]) => (
                <li key={d} className="flex justify-between">
                  <span className="flex items-center gap-2">
                    {d === 'mobile' && <Smartphone className="w-4 h-4"/>}
                    {d === 'desktop' && <Monitor className="w-4 h-4"/>}
                    <span className="capitalize">{d}</span>
                  </span>
                  <span className="font-medium">{n}</span>
                </li>
              ))}
              {aggregates.byDeviceTop.length === 0 && <li className="text-gray-500">No data yet</li>}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle>Top Referrers</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {aggregates.byReferrerTop.map(([r, n]) => (
              <li key={r} className="flex justify-between"><span>{r}</span><span className="font-medium">{n}</span></li>
            ))}
            {aggregates.byReferrerTop.length === 0 && <li className="text-gray-500">No data yet</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
