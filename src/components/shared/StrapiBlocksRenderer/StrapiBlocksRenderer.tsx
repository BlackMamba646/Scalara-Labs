'use client';

import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';

export default function StrapiBlocksRenderer({ content }: { content: BlocksContent }) {
  return <BlocksRenderer content={content} />;
}
