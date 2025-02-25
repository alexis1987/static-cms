// Register all the things
CMS.init();

const PostPreview = ({ entry, widgetFor }) => {
  return h(
    'div',
    {},
    h('div', { className: 'cover' }, h('h1', {}, entry.data.title), widgetFor('image')),
    h('p', {}, h('small', {}, 'Written ' + entry.data.date)),
    h('div', { className: 'text' }, widgetFor('body')),
  );
};

const PostPreviewCard = ({ entry, widgetFor, viewStyle }) => {
  return h(
    'div',
    { style: { width: '100%' } },
    viewStyle === 'grid' ? widgetFor('image') : null,
    h(
      'div',
      { style: { padding: '16px', width: '100%' } },
      h(
        'div',
        {
          style: {
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'start',
          },
        },
        h(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: viewStyle === 'grid' ? 'column' : 'row',
              alignItems: 'baseline',
              gap: '8px',
            },
          },
          h('strong', { style: { fontSize: '24px' } }, entry.data.title),
          h('span', { style: { fontSize: '16px' } }, entry.data.date),
        ),
        h(
          'div',
          {
            style: {
              backgroundColor: entry.data.draft === true ? 'blue' : 'green',
              color: 'white',
              border: 'none',
              padding: '4px 8px',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'inline-block',
              cursor: 'pointer',
              borderRadius: '4px',
            },
          },
          entry.data.draft === true ? 'Draft' : 'Published',
        ),
      ),
    ),
  );
};

const GeneralPreview = ({ widgetsFor, entry, collection }) => {
  const title = entry.data.site_title;
  const posts = entry.data.posts;
  const thumb = posts && posts.thumb;

  const thumbUrl = useMediaAsset(thumb, collection, undefined, entry);

  return h(
    'div',
    {},
    h('h1', {}, title),
    h(
      'dl',
      {},
      h('dt', {}, 'Posts on Frontpage'),
      h('dd', {}, widgetsFor('posts').widgets.front_limit ?? 0),

      h('dt', {}, 'Default Author'),
      h('dd', {}, widgetsFor('posts').data?.author ?? 'None'),

      h('dt', {}, 'Default Thumbnail'),
      h('dd', {}, thumb && h('img', { src: thumbUrl })),
    ),
  );
};

const AuthorsPreview = ({ widgetsFor }) => {
  return h(
    'div',
    {},
    h('h1', {}, 'Authors'),
    widgetsFor('authors').map(function (author, index) {
      return h(
        'div',
        { key: index },
        h('hr', {}),
        h('strong', {}, author.data.name),
        author.widgets.description,
      );
    }),
  );
};

const RelationKitchenSinkPostPreview = ({ fieldsMetaData }) => {
  // When a post is selected from the relation field, all of it's data
  // will be available in the field's metadata nested under the collection
  // name, and then further nested under the value specified in `value_field`.
  // In this case, the post would be nested under "posts" and then under
  // the title of the selected post, since our `value_field` in the config
  // is "title".
  const post = fieldsMetaData && fieldsMetaData.posts.value;
  const style = { border: '2px solid #ccc', borderRadius: '8px', padding: '20px' };
  return post
    ? h(
        'div',
        { style: style },
        h('h2', {}, 'Related Post'),
        h('h3', {}, post.title),
        h('img', { src: post.image }),
        h('p', {}, (post.body ?? '').slice(0, 100) + '...'),
      )
    : null;
};

const CustomPage = () => {
  return h('div', {}, 'I am a custom page!');
};

CMS.registerPreviewTemplate('posts', PostPreview);
CMS.registerPreviewCard('posts', PostPreviewCard);
CMS.registerPreviewTemplate('general', GeneralPreview);
CMS.registerPreviewTemplate('authors', AuthorsPreview);
// Pass the name of a registered control to reuse with a new widget preview.
CMS.registerWidget('relationKitchenSinkPost', 'relation', RelationKitchenSinkPostPreview);
CMS.registerAdditionalLink({
  id: 'example',
  title: 'Example.com',
  data: 'https://example.com',
  options: {
    icon: 'page',
  },
});
CMS.registerAdditionalLink({
  id: 'custom-page',
  title: 'Custom Page',
  data: CustomPage,
  options: {
    icon: 'page',
  },
});

CMS.registerShortcode('youtube', {
  label: 'YouTube',
  openTag: '[',
  closeTag: ']',
  separator: '|',
  toProps: args => {
    if (args.length > 0) {
      return { src: args[0] };
    }

    return { src: '' };
  },
  toArgs: ({ src }) => {
    return [src];
  },
  control: ({ src, onChange }) => {
    return h('span', {}, [
      h('input', {
        key: 'control-input',
        value: src,
        onChange: event => {
          onChange({ src: event.target.value });
        },
      }),
      h(
        'iframe',
        {
          key: 'control-preview',
          width: '420',
          height: '315',
          src: `https://www.youtube.com/embed/${src}`,
        },
        '',
      ),
    ]);
  },
  preview: ({ src }) => {
    return h(
      'span',
      {},
      h(
        'iframe',
        {
          width: '420',
          height: '315',
          src: `https://www.youtube.com/embed/${src}`,
        },
        '',
      ),
    );
  },
});
