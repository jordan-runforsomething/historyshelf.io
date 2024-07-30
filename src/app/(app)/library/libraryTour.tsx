/**
 * Tour to play on library page after first successful import.
 * Note all you need to do is include this component on a page to show the tour
 */

import Joyride, { Step } from "react-joyride"

const STEPS: Step[] = [
  {
    target: ".tour-title",
    content:
      "Welcome to your library. Here you'll find all of your books, including the ones you just added!",
  },
  {
    target: ".tour-books",
    content:
      "Books are the foundation of Historio. Add books you've read or are interested in to compare them on a timeline.",
  },
  {
    target: ".tour-insights",
    content:
      "Historio automatically identifies the most important historical events and dated facts from your books. These are Insights.",
  },
  {
    target: ".tour-notes",
    content:
      "You can also add your own notes on books, or import your Kindle notes. Dated notes you add will appear on your Timelines",
  },
  {
    target: ".tour-goodreads-import",
    content:
      "Search for and add books or import your latest reads from Goodreads to add to your library.",
  },
]

export default function LibraryTour() {
  return <Joyride steps={STEPS}></Joyride>
}
