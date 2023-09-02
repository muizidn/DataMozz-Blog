import PostsGrid from '@/components/posts/posts-grid';
import SubscribeNewsletter from '@/components/subscribe-newsletter';
import { getAllPosts } from '@/services/posts';

export const metadata = {
  title: 'Welcome | DataMozz',
};

export default async function HomePage() {
  const allPosts = await getAllPosts();

  return (
    <>
      <h1 className="mt-12 text-center text-3xl font-bold">
        Hello, Let's Learn, Enrich, Analyze Data with Mozz 🤖
      </h1>
      <h2 className="mt-12 text-center text-3xl">
        Bring Your Data to Live. Draw Insight and Make Profit.
      </h2>
      <h3 className="mt-12 text-center text-3xl">
        You Can Start Your Journey with Mozz. Start Simple.
      </h3>
      <h3 className="mt-12 text-center text-3xl">OK?</h3>
      <div className="space-y-4">
        <h2 className="mt-12 text-center text-3xl font-bold">
          Weekly update is a must. Sometimes more.
        </h2>
        <div className="grid justify-items-center">
          <SubscribeNewsletter />
        </div>
      </div>
      <h2 className="mt-12 text-3xl font-bold">Post for Today</h2>
      <PostsGrid paginate={false} allPosts={allPosts.slice(0,12)} />
      <h2 className="mt-12 text-3xl font-bold">Other Posts</h2>
      <PostsGrid paginate={false} allPosts={allPosts.reverse().slice(0,12)} />
    </>
  );
}
