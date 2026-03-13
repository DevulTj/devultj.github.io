import React from 'react'
import Layout from './Layout.jsx'
import Button from './Button.jsx'
import PageHeader from './PageHeader.jsx'

export default function CVPage() {
  return (
    <Layout title="CV" currentPath="/cv/">
      <PageHeader title="CV" />
      <div className="cv-container">
        <div className="cv-notice">
          <p>Place your <code>resume.pdf</code> in <code>src/content/cv/</code> to display it here.</p>
          <Button href="/cv/resume.pdf" download>Download PDF</Button>
        </div>
        <iframe
          src="/cv/resume.pdf"
          className="cv-iframe"
          title="Curriculum Vitae"
          width="100%"
          height="900px"
        />
      </div>
    </Layout>
  )
}
