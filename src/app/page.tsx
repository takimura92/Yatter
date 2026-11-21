import { Timeline } from "@/components/Timeline";
import { TimelineFeed } from "@/components/TimelineFeed";
import { Yweet } from "@/types/yweet";

/**
 * タイムライン（ホーム）
 * docs/02_timeline.md を見ながら、ここで API から Yweet を取得して表示する
 */

const url = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function Home() {
  const data = await fetch(url + "/v1/timelines/public")
  const yweets =(await data.json())as Yweet[];
  return (
    <Timeline>
      <TimelineFeed initialYweets={yweets}/>
    </Timeline>
  )
}
