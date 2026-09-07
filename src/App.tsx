import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
import { SortingIndex } from '@/pages/SortingIndex'
import { SortingAlgorithmPage } from '@/pages/SortingAlgorithmPage'
import { NotFound } from '@/pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sorting" element={<SortingIndex />} />
        <Route path="/sorting/:algorithmId" element={<SortingAlgorithmPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
