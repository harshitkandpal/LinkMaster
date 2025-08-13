import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { useParams, type Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";


interface Collection{
  id: number;
  name: string;
  links: Link[]|[];
  description: string;
}

interface Link {
  id: number;
  url: string;
  title: string;
  description: string;
}

export const CollectionDetails: React.FC = () => {
  
  const { collectionId } = useParams<{ collectionId: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [filteredLinks, setFilteredLinks] = useState<Link[] | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [links, setLinks] = useState<Link[]>([]);

  // Add Link form
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkDescription, setLinkDescription] = useState("");
  const [selectedLinkId, setSelectedLinkId] = useState<number | null>(null);
  const [addingNewLink, setAddingNewLink] = useState(false);

  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
  fetch(`http://localhost:8080/api/collections/${collectionId}`)
    .then(res => res.json())
    .then(data => {
      setCollection(data);
      setFilteredLinks(data.links || []);
    });

  fetch("http://localhost:8080/api/link/")
    .then(res => res.json())
    .then(data => setLinks(data));
}, [collectionId]);

  const handleSearch = (searchItem: string) => {
    if(timer.current) {
      clearTimeout(timer.current);
    }
    if (!searchItem) {
      setFilteredLinks(collection?.links || []);
      return;
    }
    timer.current = setTimeout(() => {
      const filtered = collection?.links.filter(link =>
        link.title.toLowerCase().includes(searchItem.toLowerCase())
      );
      setFilteredLinks(filtered || []);
    }, 300);
  }

  const handleSaveLink = () => {
  if (addingNewLink) {
    // Step 1: Create the new link
    fetch("http://localhost:8080/api/link/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: linkUrl, title: linkTitle, description: linkDescription }),
    })
      .then(res => res.json())
      .then(newLink => {
        // Step 2: Associate it with this collection
        return fetch(`http://localhost:8080/api/collections/${collectionId}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ link_ids: [newLink.id] }),
        }).then(() => {
          setFilteredLinks(prev => [...(prev || []), newLink]);
          setLinks(prev => [...prev, newLink]);
          setLinkDialogOpen(false);
        });
      });
  } else {
    if (!selectedLinkId) {
      alert("Please select a link");
      return;
    }
    // Associate existing link with the collection
    console.log("Adding existing link with ID:", selectedLinkId);
    fetch(`http://localhost:8080/api/collections/${collectionId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link_ids: [selectedLinkId] }),
    }).then(() => {
      const addedLink = links.find(l => l.id === selectedLinkId);
      if (addedLink) {
        setFilteredLinks(prev => [...(prev || []), addedLink]);
      }
      setLinkDialogOpen(false);
    });
  }
};

  return (
  
    <div className="md:container md:mx-auto px-4">
      <div className="font-bold lg:text-[5rem] sm:text-[3rem] text-[2rem]">{collection?.name}</div>
      <div className="lg:text-[1rem] sm:text-[0.875rem] text-[0.75rem]">{collection?.description}</div>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search links..."
          onChange={(e) => handleSearch(e.target.value)}
          className="border p-2 rounded max-w-sm"
        />
        <Button
          onClick={() => setLinkDialogOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg"
        >
          + Add Collection
        </Button>
    </div>
  
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] sm:text-[0.875rem] text-[0.75rem]">Title</TableHead>
          <TableHead className="sm:text-[0.875rem] text-[0.75rem]">Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredLinks?.map((link: Link) => (
          <TableRow key={link.id}>
            <TableCell className=" sm:text-[0.875rem] text-[0.75rem]">
              <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
            </TableCell>
            <TableCell className="sm:text-[0.875rem] text-[0.75rem] whitespace-normal break-words">{link.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    {/* Add Link Modal */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
  <DialogContent className="bg-gray-900 text-white rounded-xl p-6 max-w-md mx-auto">
    <DialogHeader>
      <DialogTitle className="text-xl font-bold">Add Link to {collection?.name}</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <div>
        <Label>Select Existing Link</Label>
        <Select
          onValueChange={(val) => {
            if (val === "add_new") {
              setAddingNewLink(true);
              setSelectedLinkId(null);
            } else {
              setAddingNewLink(false);
              setSelectedLinkId(Number(val));
            }
          }}
        >
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue placeholder="Choose a link" />
          </SelectTrigger>
          <SelectContent>
            {links.map(link => (
              <SelectItem key={link.id} value={String(link.id)}>
                {link.title || link.url}
              </SelectItem>
            ))}
            <SelectItem value="add_new">➕ Add new link</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {addingNewLink && (
        <>
          <div>
            <Label>URL</Label>
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <div>
            <Label>Title</Label>
            <Input
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="Optional title"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={linkDescription}
              onChange={(e) => setLinkDescription(e.target.value)}
              placeholder="Optional description"
              className="bg-gray-800 border-gray-700"
            />
          </div>
        </>
      )}
    </div>
    <DialogFooter>
      <Button onClick={() => setLinkDialogOpen(false)} variant="outline">
        Cancel
      </Button>
      <Button onClick={handleSaveLink} className="bg-green-600 hover:bg-green-700">
        Save Link
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  )
}
