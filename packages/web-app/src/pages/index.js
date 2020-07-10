import { keystone } from '@john/cms'
import { GET_ALL_PROJECTS } from '@john/api'
import ProjectCard from '../components/ProjectCard'
import ToTop from '../components/ToTop'
import ContactForm from '../components/Contact'

export default function Home({ projects }) {

  let cards = projects.map((p) => <ProjectCard key={p.id} {...p} />)
  return (
    <div className="home page">
      <h1 className="title">John Trainum</h1>
      <div className="cards">
        {cards}
      </div>
      <div className="footer">
        <ContactForm />
        <ToTop />
      </div>
    </div>
  )
}

Home.defaultProps = {
  projects: []
}

export async function getServerSideProps(ctx) {

  // Uses the keystone instance to make a graphQL request.
  try {
    const keystoneContext = keystone.createContext({ skipAccessControl: true })
    const { data, errors } = await keystone.executeGraphQL({
      context: keystoneContext,
      query: GET_ALL_PROJECTS
    })


    if (errors) throw new Error('Error executing Keystone GraphQL Query', errors)

    return {
      props: {
        projects: data.allProjects || []
      }
    }
  } catch (err) {
    console.error(err)
    return { props: { projects: [] } }
  }
}