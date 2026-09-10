import { CalendarView } from "./components/calendar/CalendarView"
import { EventsProvider } from "./context/eventsContext"

function App() {
  return (
    <EventsProvider>
      <div className="h-screen w-screen">
        <CalendarView/>
      </div>
    </EventsProvider>
  )
}

export default App
