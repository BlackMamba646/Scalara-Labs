import './LegalContent.css';

export interface StrapiTextChild {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface StrapiLinkChild {
  type: 'link';
  url: string;
  children: StrapiTextChild[];
}

export type StrapiInlineNode = StrapiTextChild | StrapiLinkChild;

export interface StrapiBlock {
  type: string;
  children: StrapiInlineNode[];
  level?: number;
  format?: string;
}

interface LegalContentProps {
  title: string;
  content?: StrapiBlock[];
  lastUpdated?: string;
}

function renderInline(node: StrapiInlineNode, i: number) {
  if (node.type === 'link') {
    return (
      <a key={i} href={node.url}>
        {node.children.map((c, j) => renderText(c, j))}
      </a>
    );
  }
  return renderText(node, i);
}

function renderText(node: StrapiTextChild, i: number) {
  let el: React.ReactNode = node.text;
  if (node.bold) el = <strong key={`b${i}`}>{el}</strong>;
  if (node.italic) el = <em key={`i${i}`}>{el}</em>;
  if (node.underline) el = <u key={`u${i}`}>{el}</u>;
  if (node.strikethrough) el = <s key={`s${i}`}>{el}</s>;
  if (node.code) el = <code key={`c${i}`}>{el}</code>;
  return <span key={i}>{el}</span>;
}

function renderBlock(block: StrapiBlock, i: number) {
  const children = block.children.map(renderInline);

  switch (block.type) {
    case 'heading': {
      const Tag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
      return <Tag key={i}>{children}</Tag>;
    }
    case 'list': {
      const Tag = block.format === 'ordered' ? 'ol' : 'ul';
      return <Tag key={i}>{children}</Tag>;
    }
    case 'list-item':
      return <li key={i}>{children}</li>;
    default:
      return <p key={i}>{children}</p>;
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function LegalContent({ title, content, lastUpdated }: LegalContentProps) {
  const displayDate = lastUpdated ? formatDate(lastUpdated) : 'January 1, 2026';

  return (
    <section className="legal-content">
      <div className="legal-content__container content-container">
        <h1 className="legal-content__title">{title}</h1>
        <p className="legal-content__updated">Last updated: {displayDate}</p>

        <div className="legal-content__body">
          {content ? (
            content.map(renderBlock)
          ) : (
            <>
              <p>
                This is placeholder content for the {title} page. The actual legal
                text will be added here soon.
              </p>
              <p>
                Please check back later for the full {title.toLowerCase()} details.
                If you have any questions in the meantime, contact us at{' '}
                <a href="mailto:contact@scalaralabs.com">contact@scalaralabs.com</a>.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
