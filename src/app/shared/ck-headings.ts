interface HeadingConfig {
  model:
    | 'heading1'
    | 'heading2'
    | 'heading3'
    | 'heading4'
    | 'heading5'
    | 'heading6'
    | 'paragraph';
  title: string;
  class: string;
  view: string;
}

export const headings: HeadingConfig[] = [
  {
    model: 'paragraph',
    title: 'Paragraph',
    class: 'ck-heading_paragraph',
    view: 'p',
  },
  {
    model: 'heading1',
    view: 'h1',
    title: 'Heading 1',
    class: 'ck-heading_heading1',
  },
  {
    model: 'heading2',
    view: 'h2',
    title: 'Heading 2',
    class: 'ck-heading_heading2',
  },
  {
    model: 'heading3',
    view: 'h3',
    title: 'Heading 3',
    class: 'ck-heading_heading3',
  },
  {
    model: 'heading4',
    view: 'h4',
    title: 'Heading 4',
    class: 'ck-heading_heading4',
  },
  {
    model: 'heading5',
    view: 'h5',
    title: 'Heading 5',
    class: 'ck-heading_heading5',
  },
  {
    model: 'heading6',
    view: 'h6',
    title: 'Heading 6',
    class: 'ck-heading_heading6',
  },
];
