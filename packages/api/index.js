module.exports = {
  GET_ALL_PROJECTS: `
    query getAllProjects {
      allProjects(sortBy: createdAt_DESC) {
        id
        name
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