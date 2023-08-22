import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ExtendedRecordMap } from 'notion-types';

import BlogComments from '@/components/blog-comment';
import NotionPage from '@/components/notion-page';
import RelatedPosts from '@/components/posts/related-posts';
import { getPageRawRecordMap } from '@/libs/notion';
import {
  saveRecordMapToDatabase,
  readRecordMapFromDatabase,
} from '@/services/db_record_map';
import { getAllPostsSlugs, getPostWithSlug, getRelatedPosts } from '@/services/posts';

export default async function PostPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const post = await getPostWithSlug(slug)
  if (!post) {
    return notFound();
  }

  if (!post.published) {
    return (
      <article
        data-revalidated-at={new Date().getTime()}
        className="mx-auto mt-40 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold">Post Not Found</h2>
        <Link href="/blog">
          <span className="mr-2">&larr;</span>
          <span>Go to list page</span>
        </Link>
      </article>
    );
  }

  const relatedPosts = await getRelatedPosts(post);
  let recordMap = await readRecordMapFromDatabase(post.id);
  if (recordMap === null) {
    const recordMapRaw = await getPageRawRecordMap(post.id);
    recordMap = recordMapRaw.recordMap;
  }
  const extendedRecordMap = recordMap as unknown as ExtendedRecordMap;
  saveRecordMapToDatabase(post.id, recordMap);

  let image = null;
  if (post.cover !== null) {
    image = (
      <div className="relative aspect-[3/2] w-[90vw] max-w-[900px]">
        <Image
          src={post.cover}
          alt="cover"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
    );
  }
  return (
    <>
      <article
        data-revalidated-at={new Date().getTime()}
        className="mt-4 flex flex-col items-center md:mt-20"
      >
        {image}
        <NotionPage post={post} recordMap={extendedRecordMap} />
      </article>
      <div className="mx-60 items-center">
        <BlogComments post={post} />
      </div>
      <RelatedPosts posts={relatedPosts} />
    </>
  );
}

export async function generateStaticParams() {
  const slugs = await getAllPostsSlugs();

  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostWithSlug(slug);

  return post
    ? {
        title: post.title,
        openGraph: {
          images: [
            {
              url: post.cover || '',
              width: 400,
              height: 300,
            },
          ],
        },
      }
    : {};
}
