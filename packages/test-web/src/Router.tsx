import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import BasicFormPage from './routes/BasicFormPage'

function RouterConfig() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/form/basic" element={<BasicFormPage />} />
      </Routes>
    </HashRouter>
  )
}

export default RouterConfig
