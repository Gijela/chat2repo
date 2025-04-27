import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { repo_name, user_prompt, query_id } = await request.json();
    console.log(repo_name, user_prompt, query_id);
    
    const response = await fetch('https://api.devin.ai/ada/query', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'content-type': 'application/json',
        'origin': 'https://deepwiki.com',
        'referer': 'https://deepwiki.com/',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        engine_id: "multihop",
        user_query: `<relevant_context>This query was sent from the wiki page: ${repo_name.split('/')[1]} Overview.</relevant_context> ${user_prompt}`,
        keywords: [],
        repo_names: [repo_name],
        additional_context: "",
        query_id: query_id,
        use_notes: false,
        generate_summary: false
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create query' },
      { status: 500 }
    );
  }
}
