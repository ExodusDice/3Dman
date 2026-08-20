import { NextResponse } from 'next/server';
import { CURATED_FREE_STL_DATABASE, STL_CATEGORIES, STL_PLATFORMS } from '@/lib/stl-data';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').toLowerCase().trim();
    const category = searchParams.get('category') || 'all';
    const platform = searchParams.get('platform') || 'all';

    let results = CURATED_FREE_STL_DATABASE;

    // Filter by Category
    if (category && category !== 'all') {
      results = results.filter((m) => m.category === category);
    }

    // Filter by Platform Source
    if (platform && platform !== 'all') {
      results = results.filter((m) => m.source.toLowerCase() === platform.toLowerCase());
    }

    // Search query
    if (query) {
      results = results.filter((m) => {
        return (
          m.title.toLowerCase().includes(query) ||
          m.titleTh.toLowerCase().includes(query) ||
          m.creator.toLowerCase().includes(query) ||
          m.tags.some((t) => t.toLowerCase().includes(query)) ||
          m.description.toLowerCase().includes(query) ||
          m.descriptionTh.toLowerCase().includes(query)
        );
      });
    }

    return NextResponse.json({
      success: true,
      total: results.length,
      models: results,
      categories: STL_CATEGORIES,
      platforms: STL_PLATFORMS,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
