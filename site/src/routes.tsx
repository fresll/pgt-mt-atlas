import type { RouteRecord } from 'vite-react-ssg'
import { ScienceLayout, Shell } from './components/Layout'
import type { Lang } from './data/atlas'
import { LANGS } from './i18n'
import About from './pages/About'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Contribute from './pages/Contribute'
import { CHAPTER_SLUGS } from './content/fundamentals'
import { ChapterPage, FundamentalsIndex, FundamentalsLayout, FundamentalsReferences } from './pages/fundamentals/Fundamentals'
import Curator from './pages/Curator'
import Patients from './pages/patients/Patients'
import RootRedirect from './pages/RootRedirect'
import Cases from './pages/science/Cases'
import Data from './pages/science/Data'
import Fig3 from './pages/science/Fig3'
import Fig4 from './pages/science/Fig4'
import Fig5 from './pages/science/Fig5'
import Fig6 from './pages/science/Fig6'
import Methods from './pages/science/Methods'
import ScienceIndex from './pages/science/ScienceIndex'
import Sources from './pages/science/Sources'

function langRoutes(lang: Lang): RouteRecord {
  return {
    path: `/${lang}`,
    element: <Shell lang={lang} />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'science',
        element: <ScienceLayout lang={lang} />,
        children: [
          { index: true, element: <ScienceIndex /> },
          { path: 'data', element: <Data /> },
          { path: 'heteroplasmy-landscape', element: <Fig3 /> },
          { path: 'embryo-concordance', element: <Fig4 /> },
          { path: 'embryo-to-offspring', element: <Fig5 /> },
          { path: 'pgt-mt-pgt-a-model', element: <Fig6 /> },
          { path: 'cases', element: <Cases /> },
          { path: 'sources', element: <Sources /> },
          { path: 'methods', element: <Methods /> },
        ],
      },
      {
        path: 'fundamentals',
        element: <FundamentalsLayout lang={lang} />,
        children: [
          { index: true, element: <FundamentalsIndex /> },
          ...CHAPTER_SLUGS.map((slug) => ({ path: slug, element: <ChapterPage slug={slug} /> })),
          { path: 'references', element: <FundamentalsReferences /> },
        ],
      },
      { path: 'patients', element: <Patients /> },
      { path: 'contribute', element: <Contribute /> },
      { path: 'about', element: <About /> },
      { path: 'ilya-mazunin', element: <Curator /> },
      { path: '*', element: <NotFound /> },
    ],
  }
}

export const routes: RouteRecord[] = [{ path: '/', element: <RootRedirect /> }, ...LANGS.map(langRoutes)]
