require('dotenv').config({
  path: '../../.env'
})

const { Keystone } = require('@keystonejs/keystone');
const { MongooseAdapter} = require('@keystonejs/adapter-mongoose');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { Text, Checkbox, Password, Relationship, File} = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
const { atTracking } = require('@keystonejs/list-plugins');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { S3Adapter } = require('@keystonejs/file-adapters');
const { NextApp } = require('@keystonejs/app-next');
const {initializeData} = require('./initialize-data')

const PROJECT_NAME = 'john';
const DEV = process.env.NODE_ENV !== 'production'

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost/john'

const adapterConfig = {
  mongoUri: mongoURL
 };


const accessKey = process.env.DO_ACCESS_KEY
const secretKey = process.env.DO_SECRET_KEY
const endpoint = process.env.DO_ENDPOINT
const bucketName = process.env.S3_BUCKET_NAME

const s3Options = {
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
  endpoint: 'https://sfo2.digitaloceanspaces.com'
};

const photoAdapter = new S3Adapter({
  bucket: bucketName,
  folder: 'john-trainum',
  publicUrl: ({ id, filename, _meta }) =>
    `https://sudo-portfolio-space.sfo2.digitaloceanspaces.com/john-trainum/${filename}`,
  s3Options: s3Options,
  uploadParams: ({ filename, id, mimetype, encoding }) => ({
    Metadata: {
      keystone_id: id.toString(),
    },
    ACL: 'public-read'
  }),
});

// create basic keystone instance
const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new MongooseAdapter(adapterConfig),
  cookie: {
    secure: DEV ? false : true, // Defaults to true in production
    maxAge: 1000 * 60 * 60 * 24 * 7, // 30 days
    sameSite: false,
  },
  cookieSecret: process.env.COOKIE_SECRET || 'very-secret',
  onConnect: initializeData
});

keystone.createList('Project', {
  fields: {
    name: {
      type: Text,
      adminDoc: 'This is just for you to identify them'
    },
    description: {
      type: Wysiwyg,
      adminDoc: 'This will appear over the image',
      require: true,
      editorConfig: {
        plugins: [
          'link lists'
        ],
        contextmenu: "link lists",
      }
    },
    photo: {
      type: Relationship,
      ref: 'Photo',
      require: true
    },
  },
  plugins: [
    atTracking({})
  ],
  labelResolver: (item) => item.name
});

keystone.createList('Photo', {
  fields: {
    file: {
      require: true,
      type: File,
      adapter: photoAdapter,
      adminDoc: 'For best results, resize images to 600x600. Images without a 1x1 ratio will be scaled to fit a square.',
      hooks: {
        beforeChange: async (ctx) => {
          // delete the existing file if it exists
          if (ctx.existingItem && ctx.existingItem.file) {
            await photoAdapter.delete(ctx.existingItem.file);
          }
        },
      }
    }
  },
  hooks: {
    afterDelete: async ({existingItem}) => {
      if(existingItem.file){
        await photoAdapter.delete(existingItem.file);
      }
    },
  },
  labelResolver: (item) => `${item.file.originalFilename}`
})


// user access functions
const userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }

  // Instead of a boolean, you can return a GraphQL query:
  // https://www.keystonejs.com/api/access-control#graphqlwhere
  return { id: user.id };
};

const userIsAdminOrOwner = auth => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};

const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };


// create User
keystone.createList('User', {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
    },
    isAdmin: {
      type: Checkbox,
      // Field-level access controls
      // Here, we set more restrictive field access so a non-admin cannot make themselves admin.
      access: {
        update: access.userIsAdmin,
      },
    },
    password: {
      type: Password,
    },
  },
  // // List-level access controls
  access: {
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  }
});

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      name: "john trainum",
      adminPath: '/admin',
      authStrategy
    }),
    new NextApp({dir: '../web-app'})
  ],
};