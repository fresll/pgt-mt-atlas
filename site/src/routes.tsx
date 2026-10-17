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
import Landscape from './pages/science/Landscape'
import Concordance from './pages/science/Concordance'
import Offspring from './pages/science/Offspring'
import Model from './pages/science/Model'
import Methods from './pages/science/Methods'
import ScienceIndex from './pages/science/ScienceIndex'
import Sources from './pages/science/Sources'

const englishReview = import.meta.env.VITE_ATLAS_PRIVATE_PREVIEW === '1' && import.meta.env.VITE_ATLAS_ENGLISH_REVIEW === '1'

function langRoutes(lang: Lang): RouteRecord {
  return {
    path: `/${lang}`,
    element: lang === 'en' && !englishReview ? <RootRedirect /> : <Shell lang={lang} />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'science',
        element: <ScienceLayout lang={lang} />,
        children: [
          { index: true, element: <ScienceIndex /> },
          { path: 'data', element: <Data /> },
          { path: 'heteroplasmy-landscape', element: <Landscape /> },
          { path: 'embryo-concordance', element: <Concordance /> },
          { path: 'embryo-to-offspring', element: <Offspring /> },
          { path: 'pgt-mt-pgt-a-model', element: <Model /> },
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
          ...CHAPTER_SLUGS.map((slug) => ({ path: slug, element: <ChapterPage key={slug} slug={slug} /> })),
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
