import React from 'react';

export interface BulletPointOptions {
  className?: string;
  boldClassName?: string;
}

/**
 * Common utility to render bullet points or formatted text with a bold title prefix.
 *
 * If the input string contains a colon (':'), the prefix before the colon (including ':')
 * is rendered in <strong>, followed by the rest of the text as regular body text.
 * If no colon is present, the text is rendered inside a <span>.
 *
 * @param text The bullet point or label text to render.
 * @param options Optional CSS classes for the outer wrapper span and inner <strong> tag.
 * @returns React.ReactNode
 */
export function renderBulletPoint(
  text: string,
  options?: BulletPointOptions
): React.ReactNode {
  if (!text) return null;

  const colonIndex = text.indexOf(':');
  if (colonIndex !== -1) {
    const boldPart = text.slice(0, colonIndex);
    const rest = text.slice(colonIndex + 1);
    return (
      <span className={options?.className}>
        <strong className={options?.boldClassName}>{boldPart}:</strong>
        {rest}
      </span>
    );
  }

  return <span className={options?.className}>{text}</span>;
}

export interface BulletPointProps extends BulletPointOptions {
  text: string;
}

/**
 * Reusable React component wrapper for renderBulletPoint.
 *
 * Usage:
 * `<BulletPoint text={t('home.capabilities.pillar1Point1')} />`
 */
export const BulletPoint: React.FC<BulletPointProps> = ({
  text,
  className,
  boldClassName
}) => {
  return <>{renderBulletPoint(text, { className, boldClassName })}</>;
};
