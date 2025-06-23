
import { ArtistsTable } from "@/compomnents/artists-table"
// import artistsData from "@/data/artists.json"

export default async function DashboardPage() {
   const data = await fetch('https://ba3a233e-6114-4fd4-8ac6-9f3016bf52b1.mock.pstmn.io/artists')
  const posts = await data.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your artists and track performance</p>
        </div>

        <ArtistsTable artists={posts} />
      </div>
    </div>
  )
}
