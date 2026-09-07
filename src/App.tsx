import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
import { SortingIndex } from '@/pages/SortingIndex'
import { SortingAlgorithmPage } from '@/pages/SortingAlgorithmPage'
import { SearchingIndex } from '@/pages/SearchingIndex'
import { SearchingAlgorithmPage } from '@/pages/SearchingAlgorithmPage'
import { GraphIndex } from '@/pages/GraphIndex'
import { GraphAlgorithmPage } from '@/pages/GraphAlgorithmPage'
import { TreesIndex } from '@/pages/TreesIndex'
import { TreesAlgorithmPage } from '@/pages/TreesAlgorithmPage'
import { BstOperationsPage } from '@/pages/BstOperationsPage'
import { PathfindingIndex } from '@/pages/PathfindingIndex'
import { PathfindingAlgorithmPage } from '@/pages/PathfindingAlgorithmPage'
import { RacePage } from '@/pages/RacePage'
import { NotFound } from '@/pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sorting" element={<SortingIndex />} />
        <Route path="/sorting/:algorithmId" element={<SortingAlgorithmPage />} />
        <Route path="/searching" element={<SearchingIndex />} />
        <Route path="/searching/:algorithmId" element={<SearchingAlgorithmPage />} />
        <Route path="/graph" element={<GraphIndex />} />
        <Route path="/graph/:algorithmId" element={<GraphAlgorithmPage />} />
        <Route path="/trees" element={<TreesIndex />} />
        <Route path="/trees/operations" element={<BstOperationsPage />} />
        <Route path="/trees/:algorithmId" element={<TreesAlgorithmPage />} />
        <Route path="/pathfinding" element={<PathfindingIndex />} />
        <Route path="/pathfinding/:algorithmId" element={<PathfindingAlgorithmPage />} />
        <Route path="/race" element={<RacePage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
