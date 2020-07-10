module.exports = {
  GET_ALL_PROJECTS: `
    query {
      allProjects {
        id
        description
        photo {
          file {
            publicUrl
          }
        }
      }
    }
  `
}