import { useEffect, useState } from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from "chart.js"
import PieChart from "../components/PieChart"
import LineChart from "../components/LineChart"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler)

const Dashboard = () => {
  const [leads, setLeads] = useState([])

  // BUSCAR LEADS
  useEffect(() => {
    // fetch("https://projeto-tiamate-back.onrender.com/leads")
    fetch("http://localhost:3001/leads")
      .then(res => res.json())
      .then(data => setLeads(data))
  }, [])
  return (
    <>
      <div>
        <div className="flex items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Dashboard</h1>
        </div>
        <div className="flex flex-col gap-4">
          <div className="w-full h-100 rounded-2xl bg-creme/60">
            <LineChart leads={leads} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <PieChart leads={leads} title="midia" />
            <PieChart leads={leads} title="cidade" />
            <PieChart leads={leads} title="estado" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard;