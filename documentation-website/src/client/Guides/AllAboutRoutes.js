import React from 'react';
import { Link } from '@curi/react';

import BaseGuide from './base/BaseGuide';
import { InlineJS as IJS, PrismBlock } from '../components/PrismBlocks';
import { Note } from '../components/Messages';
import { Section, Subsection } from '../components/Sections';

export default ({ name }) => (
  <BaseGuide>
    <h1>{name}</h1>

    <p>
      Routes are simply JavaScript objects with two required props: name and path. There are also a number
      of other props that you can use to enhance the routes. We will cover these below.
    </p>

    <PrismBlock lang='javascript'>
      {
`{
  name: 'Home',
  path: ''
};`
      }
    </PrismBlock>

    <Section
      title='Matching Routes'
      id='matching-routes'
    >
      <p>
        First, we should cover how route matching works. Curi takes an array of route objects. Whenever Curi
        receives a new location, it will walk over the route objects in the order that they are defined in
        the array.
      </p>
      <p>
        Sometimes a route's path with only partially match the location's pathname. When this happens, the
        matching behavior will vary based on the route's props. By default, routes perform exact matching.
        This means that when the route only matches part of the pathname, it does not count as a match.
      </p>
      <PrismBlock lang='javascript'>
        {
`// when the pathname is '/a/Run+The+Jewels+3/Hey+Kids',
// the Album route will partially match the pathname. However,
// Curi looks for complete matches, so it will move on to the
// next route
{
  name: 'Album',
  path: 'a/:album'
}`
        }
      </PrismBlock>
      <p>
        However, if the route has children, then Curi will check if any of those routes form a complete
        match before moving on to the next route in the routes array.
      </p>
      <PrismBlock lang='javascript'>
        {
`// when the pathname is '/a/Coloring+Book/All+Night',
// the Album route will partially match the pathname. Then,
// its child route Song will be tested and fully match the pathname.
{
  name: 'Album',
  path: 'a/:album',
  children: [
    {
      name: 'Song',
      path: ':title'
    }
  ]
}`
        }
      </PrismBlock>
      <p>
        Another possibility happens when you use the <IJS>pathOptions</IJS> object to set{' '}
        <IJS>end: false</IJS>. When you do that, then a route the partially matches will consider
        itself matched.
      </p>
      <PrismBlock lang='javascript'>
        {
`// when the pathname is '/a/Good+Kid,+M.A.A.D+City/Poetic+Justice',
// the Album route will partially match. However, because it sets
// end to false, the partial match will be used.
{
  name: 'Album',
  path: 'a/:albumID',
  pathOptions: {
    end: false
  }
}`
        }
      </PrismBlock>
      <p>
        If none of your routes match a pathname, then Curi will set a "404" status on the response object.
        The body property of the response will also be <IJS>undefined</IJS>, so it is important
        that your application checks the response's status when it goes to render a response. You can also
        add a wildcard route (<IJS>path: '*'</IJS>) to the end of your routes array, and that route
        will always match. You may want to still manually set the status to "404" for the wildcard route, but
        it is not required.
      </p>
    </Section>

    <Section
      title='Route properties'
      id='route-properties'
    >

      <Subsection
        title='name'
        id='name'
      >
        <p>
          A unique identifier. This should be a string or a symbol.
        </p>
      </Subsection>

      <Subsection
        title='path'
        id='path'
      >
        <p>
          A path-to-regexp style string. This should <strong>not</strong> have a leading slash. The string
          will be passed to path-to-regexp to generate a regular expression. Any{' '}
          <a href="https://github.com/pillarjs/path-to-regexp#parameters">parameters</a> will be identified
          so that they can be parsed out when matching against a location's pathname.
        </p>
        <Note>
          While path-to-regexp supports arrays and RegExps, only string paths are supported here. This is
          because the path must also be reversible to create a pathname given params.
        </Note>
      </Subsection>

      <Subsection
        title='pathOptions'
        id='pathOptions'
      >
        <p>
          If you need to provide different path options than{' '}
          <a href="https://github.com/pillarjs/path-to-regexp#usage">the defaults</a> used by path-to-regexp,
          you should specify them with a <IJS>pathOptions</IJS> object.
        </p>
        <Note>
          If a route has a children array property, it will <strong>always</strong> have the <IJS>end</IJS>
          {' '} path option set to false.
        </Note>
      </Subsection>

      <Subsection
        title='body'
        id='body'
      >
        <p>
          The body property gives you the opportunity to set the body property of a response for a given
          route. This must be a function and its return value will be what is set as the response object's
          body property.
        </p>
        <PrismBlock lang='javascript'>
          {
`// when the user visits /contact, the response object's body
// property will be the Contact value
const contact = {
  name: 'Contact',
  path: 'contact',
  body: () => Contact
};`
          }
        </PrismBlock>
        <p>
          While the above example returns a single value, you might have multiple page values that you want to
          associate with a route. In that case, you can return an object with a property for each one. Then, when
          you render the application, you would access the values using <IJS>response.body.&lt;property-name&gt;</IJS>.
          {' '}If you take this approach, each route's <IJS>body</IJS> function should return an object with the same
          properties.
        </p>
        <PrismBlock lang='javascript'>
          {
`const routes = [
  {
    name: 'Home',
    path: '',
    body: () => ({ main: Home, nav: HomeNav })
  },
  {
    name: 'Contact',
    path: 'contact',
    body: () => ({ main: Contact, nav: ContactNav })
  }
];

function render(response) {
  const { main, nav } = response.body
  ...
}`
          }
        </PrismBlock>
      </Subsection>

      <Subsection
        title='title'
        id='title'
      >
        <p>
          You can use the title property of a route to specify a title string that should be set on the response
          when that route matches. This can either be a string or a function. If it is a string, then
          <IJS>response.title</IJS> will be set to the value of <IJS>route.title</IJS>. If
          it is a function, it will be called (and passed the <IJS>response.params</IJS> and{' '}
          <IJS>response.data</IJS> values) to generate the title string.
        </p>
        <p>
          If a route does not have a title property, when it matches, the response's title property will be an
          empty string.
        </p>
        <PrismBlock lang='javascript'>
          {
`// as a string
{
  name: 'Contact',
  path: 'contact',
  title: 'How to contact us'
}

// as a function
{
  name: 'Contact Method',
  path: ':method',
  title: (params, data) => \`Contact via $\{params.method\}\`
}`
          }
        </PrismBlock>
      </Subsection>

      <Subsection
        title='children'
        id='children'
      >
        <p>
          An optional array of route objects. Any child routes will be matched relative to their parent route's path.
          This means that if a parent route's path string is 'one' and a child route's path string is 'two',
          the child will match when the pathname is 'one/two'.
        </p>
      </Subsection>

      <Subsection
        title='preload'
        id='preload'
      >
        <p>
          A function that will only be called the first time that a route matches. This should only be
          used for loading resources that are required for the route to display properly. For example,
          if you are doing code splitting with Webpack using <IJS>import()</IJS>, you would
          load the modules in preload.
        </p>
        <p>
          The preload function must return a Promise.
        </p>
        <PrismBlock lang='javascript'>
          {
`const about = {
  name: 'About',
  path: 'about',
  preload: () => {
    return import('./components/About')
      .then(module => AsyncStore.register(module.default));
  }
};`
          }
        </PrismBlock>
      </Subsection>
      
      <Subsection
        title='load'
        id='load'
      >
        <p>
          A function that can be used for data fetching as well as for triggering redirects.
          The load function will be passed the a "route" object containing the params object
          that is parsed from the location's pathname (using the route and its ancestor's paths),
          the current location, and then name of the matched route. Additionally, it will be passed
          a modifiers object that can be used to modify the response object that will be created
          and an object containing all of the registered Curi addons (the <IJS>pathname</IJS> addon
          being particularly useful).
        </p>
        <p>
          Like preload, load must return a Promise.
        </p>
        <PrismBlock lang='javascript'>
          {

`// set response data
const user = {
  name: 'User',
  path: ':id',
  load: ({ params, location }, mod, addons) => {
    return fetch(\`/api/users/$\{params.id\}\`)
      .then(resp => JSON.parse(resp))
      .then(data => mod.setData(data);)
      .catch(err => {
        mod.fail(err);
        mod.setStatus(404);
      });
  }
}

// set a permanent redirect
const routes = [
  {
    name: 'Photo',
    path: 'p/:id'
  },
  {
    name: 'Old Photo',
    path: 'photo/:id',
    load: ({ params, location }, mod, addons) => {
      const pathname = addons.pathname('Photo', params);
      mod.redirect({ ...location, pathname }, 301);
    }
  }
]
// navigating to /photo/123 will automatically redirect to /p/123`
          }
        </PrismBlock>
        <p>
          What is that modifiers object that gets passed to the load function?
          It contains a number of functions that you can use to modify the response. These
          functions are <IJS>redirect</IJS>, <IJS>fail</IJS>,{' '}
          <IJS>setStatus</IJS>, and <IJS>setData</IJS>.
        </p>
        <ul>
          <li>
            <IJS>redirect(to, code)</IJS> - This allows you to turn the response into a
            redirect response. When you application receives a redirect response, it should redirect
            to the new location (using your history object) instead of re-rendering. If you do not
            provide a code, then 301 will be used. Setting the status code is mostly important for
            rendering on the server. The <IJS>to</IJS> argument should be a string or a location
            object. Once the response has been created, Curi will automatically redirect
            to the <IJS>to</IJS> location.
          </li>
          <li>
            <IJS>fail(error)</IJS> - A method to call when something goes wrong. This will
            add an error property to the response.
          </li>
          <li>
            <IJS>setStatus(code)</IJS> - This method will set a new status for the response
            (the default status is 200 when a route matches and 404 when no routes match).
          </li>
          <li>
            <IJS>setData(data)</IJS> - The value passed to this method will be set as the
            response's data property.
          </li>
        </ul>
      </Subsection>

      <Subsection
        title='params'
        id='params'
      >
        <p>
          When <IJS>path-to-regexp</IJS> matches your paths, all parameters are extracted as strings. However, you might have
          some route params to be other types. You can provide functions to transform params using the <IJS>route.params</IJS>
          {' '}object. To transform a param, its name should be the string value from the path. The paired value should be a
          function that takes a string (the value from the pathname) and returns a new value (transformed however you want).
        </p>
        <PrismBlock lang='javascript'>
          {
`const routes = [
  {
    name: 'Number',
    path: 'number/:num',
    params: {
      num: n => parseInt(n, 10)
    }
  }
]
// when the user visits /number/1,
// response.params will be { num: 1 } instead of { num: "1" }`
          }
        </PrismBlock>
      </Subsection>

      <Subsection
        title='extra'
        id='extra'
      >
        <p>
          If you have any additional properties that you want attached to a route, use the <IJS>extra</IJS> property. You will be
          able to use <IJS>route.extra</IJS> in any custom addons or when a route matches via <IJS>response.route.extra</IJS>.
        </p>

        <p>
          You can attach anything you want to <IJS>extra</IJS> or you may never find yourself needing to use this. One possible
          use case for <IJS>extra</IJS> is that you could specify entrance/exit animation types. One route might want to fade in,
          while another might slide in.
        </p>

        <PrismBlock lang='javascript'>
          {
`const routes = [
  {
    name: 'A Route',
    path: 'a-route',
    extra: {
      transition: 'fade'
    }
  },
  {
    name: 'B Route',
    path: 'b-route',
    extra: {
      enter: 'slide-right'
    }
  }
];`
          }
        </PrismBlock>
      </Subsection>
    </Section>

    <div>
      <h2>Next</h2>
      <p>
        Now that you know how to setup your routes, we can get to the good part: actually
        rendering your application using response objects. Check out the{' '}
        <Link to='Guide' params={{ slug: 'responses' }}>Rendering with Responses</Link> guide
        to learn how.
      </p>
    </div>
  </BaseGuide>
);
