const { createItems } = require('@keystonejs/server-side-graphql-client')


const defaultUsers = [
  {
    data: {
      name: process.env.USERNAME,
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
      isAdmin: true
    }
  }
]

async function initializeData(keystone) {
  console.log(' -- Adding Users')
  try {
    await createItems({
      keystone,
      listKey: 'User',
      items: defaultUsers
    });
  } catch (err) {
    if((err.path && err.path.includes('createUsers')) &&
    (err.message && err.message.includes("user_email_unique"))){
      console.log(' -- Users already exist.')
    } else {
      console.error(err)
    }
  }
}

module.exports = { initializeData, defaultUsers }