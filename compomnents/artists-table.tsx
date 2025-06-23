"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Search, Eye,  Trash2,  Star, Users, Loader2 } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

// Updated interface to match JSON structure
export interface ArtistsTableProps {
  artists: Artist[]
}

export interface Artist {
  id: string
  name: string
  category: string
  city: string
  fee: string
  email: string
  phone: string
  status: string
  joinDate: string
  rating: number
  totalBookings: number
}

export function ArtistsTable({ artists }: ArtistsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredArtists, setFilteredArtists] = useState(artists)
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Use useEffect to handle search filtering
  useEffect(() => {
    const performSearch = async () => {
      setIsSearching(true)

      // Simulate API search delay (in real app, this would be an API call)
      await new Promise((resolve) => setTimeout(resolve, 200))

      if (!debouncedSearchTerm.trim()) {
        setFilteredArtists(artists)
      } else {
        const filtered = artists.filter(
          (artist) =>
            artist.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            artist.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            artist.city.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            artist.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            artist.phone.includes(debouncedSearchTerm) ||
            artist.status.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
        )
        setFilteredArtists(filtered)
      }

      setIsSearching(false)
    }

    performSearch()
  }, [debouncedSearchTerm, artists])

  // Reset filtered artists when the original artists data changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredArtists(artists)
    }
  }, [artists, searchTerm])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleView = (artist: Artist) => {
    setSelectedArtist(artist)
  }

  const handleEdit = (artist: Artist) => {
    console.log("Edit artist:", artist)
    // In a real app, this would navigate to an edit form
    alert(`Edit functionality for ${artist.name} would be implemented here`)
  }

  const handleDelete = (artist: Artist) => {
    console.log("Delete artist:", artist)
    // In a real app, this would make an API call to delete the artist
    const updatedArtists = filteredArtists.filter((a) => a.id !== artist.id)
    setFilteredArtists(updatedArtists)
  }



  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <div className="space-y-6">
      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search artists by name, category, city, email, phone, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
          )}
          {searchTerm && !isSearching && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
            >
              ×
            </Button>
          )}
        </div>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          {isSearching && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>
            Showing {filteredArtists.length} of {artists.length} artists
            {searchTerm && ` for "${searchTerm}"`}
          </span>
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && !isSearching && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              {filteredArtists.length > 0
                ? `Found ${filteredArtists.length} artist${filteredArtists.length === 1 ? "" : "s"} matching "${searchTerm}"`
                : `No artists found matching "${searchTerm}"`}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={clearSearch} className="text-blue-600 hover:text-blue-800">
            Clear search
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Artists</p>
                <p className="text-2xl font-bold">{artists.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {artists.filter((a) => a.status === "active").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {artists.filter((a) => a.status === "pending").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {artists.length > 0
                    ? (artists.reduce((sum, a) => sum + a.rating, 0) / artists.length).toFixed(1)
                    : "0.0"}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500 fill-current" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Artists Directory</span>
            {searchTerm && (
              <Badge variant="outline" className="ml-2">
                Filtered Results
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isSearching ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Searching artists...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredArtists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {searchTerm ? (
                        <div className="space-y-2">
                          <p>No artists found matching &quot;{searchTerm}&quot;</p>
                          <Button variant="outline" size="sm" onClick={clearSearch}>
                            Clear search to see all artists
                          </Button>
                        </div>
                      ) : (
                        "No artists found"
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArtists.map((artist) => (
                    <TableRow key={artist.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {searchTerm && artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: artist.name.replace(
                                new RegExp(`(${searchTerm})`, "gi"),
                                '<mark class="bg-yellow-200 px-1 rounded">$1</mark>',
                              ),
                            }}
                          />
                        ) : (
                          artist.name
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{artist.category}</Badge>
                      </TableCell>
                      <TableCell>{artist.city}</TableCell>
                      <TableCell className="font-semibold text-purple-600">{artist.fee}</TableCell>
                      <TableCell>{getStatusBadge(artist.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{artist.rating}</span>
                          <span className="text-gray-500 text-sm">({artist.totalBookings})</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleView(artist)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete {artist.name}&apos;s profile
                                    and remove their data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(artist)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Artist Details Modal */}
      {selectedArtist && (
        <AlertDialog open={!!selectedArtist} onOpenChange={() => setSelectedArtist(null)}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>{selectedArtist.name}</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedArtist.category}</Badge>
                    {getStatusBadge(selectedArtist.status)}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Location:</span>
                      <span>{selectedArtist.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Fee Range:</span>
                      <span className="font-semibold text-purple-600">{selectedArtist.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{selectedArtist.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Bookings:</span>
                      <span>{selectedArtist.totalBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Join Date:</span>
                      <span>{new Date(selectedArtist.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span className="text-blue-600">{selectedArtist.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Phone:</span>
                      <span>{selectedArtist.phone}</span>
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleEdit(selectedArtist)}>Edit Artist</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
