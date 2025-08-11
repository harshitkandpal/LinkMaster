import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { useParams, type Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";


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
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/collections/${collectionId}`)
      .then(response => response.json())
      .then(data => {
        setCollection(data);
        console.log('Fetched collections:', data);
      })
      .catch(error => console.error('Error fetching collections:', error));
      
  }, []);

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

  return (

    <div className="md:container md:mx-auto px-4">
      <div className="font-bold lg:text-[5rem] sm:text-[3rem] text-[2rem]">{collection?.name}</div>
      <div className="lg:text-[1rem] sm:text-[0.875rem] text-[0.75rem]">{collection?.description}</div>
        <Input
          type="text"
          placeholder="Search links..."
          onChange={(e) => handleSearch(e.target.value)}
          className="border p-2 rounded max-w-sm"
        />
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
    </div>
  )
}
