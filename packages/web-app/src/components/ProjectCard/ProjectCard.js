
import React from 'react'
import ReactHTMLParser from 'react-html-parser'


export default function ProjectCard({ description, photo }) {
  return (
    <div className="project-card"
      style={{
        backgroundImage: `url('${photo.file.publicUrl}')`,
      }}>
      <div className="project-card__about">
        {ReactHTMLParser(description)}
      </div>
    </div>
  )

}
