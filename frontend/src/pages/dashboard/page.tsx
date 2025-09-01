import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Link {
  id: number;
  url: string;
  title: string;
  description: string;
}

interface Collection {
  id: number;
  name: string;
  description: string;
  links: Link[];
}

export const Dashboard: React.FC = () => {
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [filteredCollections, setFilteredCollections] = useState<
    Collection[] | null
  >(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [open, setOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLinks, setSelectedLinks] = useState<number[]>([]);

  // Add Link form
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkDescription, setLinkDescription] = useState("");

  const navigate = useNavigate();
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/collections/")
      .then((res) => res.json())
      .then((data) => {
        setCollections(data);
        setFilteredCollections(data);
      });

    fetch("http://localhost:8080/api/link/")
      .then((res) => res.json())
      .then((data) => setLinks(data));
  }, []);

  const handleCardClick = (collectionId: number) => {
    navigate(`/${collectionId}`);
  };

  const handleSearch = (searchTerm: string) => {
    if (timer.current) clearTimeout(timer.current);
    if (!searchTerm) {
      setFilteredCollections(collections);
      return;
    }
    timer.current = setTimeout(() => {
      const filtered = collections?.filter((collection) =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCollections(filtered || []);
    }, 300);
  };

  const handleSaveCollection = () => {
    if (selectedLinks.length === 0) {
      alert("Please select at least one link");
      return;
    }

    fetch("http://localhost:8080/api/collections/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, link_ids: selectedLinks }),
    })
      .then((res) => res.json())
      .then((newCollection) => {
        setCollections((prev) =>
          prev ? [...prev, newCollection] : [newCollection]
        );
        setFilteredCollections((prev) =>
          prev ? [...prev, newCollection] : [newCollection]
        );
        setOpen(false);
        setName("");
        setDescription("");
        setSelectedLinks([]);
      });
  };

  const handleAddLink = () => {
    fetch("http://localhost:8080/api/link/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: linkUrl,
        title: linkTitle,
        description: linkDescription,
      }),
    })
      .then((res) => res.json())
      .then((newLink) => {
        setLinks((prev) => [...prev, newLink]);
        setLinkDialogOpen(false);
        setLinkUrl("");
        setLinkTitle("");
        setLinkDescription("");
      });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search collections..."
          onChange={(e) => handleSearch(e.target.value)}
          className="border p-2 rounded max-w-sm"
        />
        <Button
          onClick={() => setOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg"
        >
          + Add Collection
        </Button>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        {collections ? (
          filteredCollections?.map((collection) => (
            <div
              key={collection.id}
              className="bg-card p-4 rounded-lg shadow hover:scale-[1.02] transition cursor-pointer"
              onClick={() => handleCardClick(collection.id)}
            >
              <h2 className="text-lg font-semibold">{collection.name}</h2>
              <p className="text-sm text-muted-foreground">
                {collection.description}
              </p>
            </div>
          ))
        ) : (
          <p>Loading collections...</p>
        )}
      </div>

      {/* Add Collection Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 text-white rounded-xl p-6 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Add New Collection
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter collection name"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <Label>Links</Label>
              <Select
                onValueChange={(val) => {
                  if (val === "add_new") {
                    setLinkDialogOpen(true);
                  } else {
                    setSelectedLinks([...selectedLinks, Number(val)]);
                  }
                }}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select a link" />
                </SelectTrigger>
                <SelectContent>
                  {links.map((link) => (
                    <SelectItem key={link.id} value={String(link.id)}>
                      {link.title || link.url}
                    </SelectItem>
                  ))}
                  <SelectItem value="add_new">➕ Add new link</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-xs mt-2 text-gray-400">
                Selected: {selectedLinks.length} link(s)
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handleSaveCollection}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Link Modal */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="bg-gray-900 text-white rounded-xl p-6 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Add New Link
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
          </div>
          <DialogFooter>
            <Button onClick={() => setLinkDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handleAddLink}
              className="bg-green-600 hover:bg-green-700"
            >
              Save Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
