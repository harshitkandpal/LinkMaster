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
import { useParams, type Link } from "react-router-dom";
import { useEffect, useState } from "react";


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

  useEffect(() => {
    fetch(`http://localhost:8080/api/collections/${collectionId}`)
      .then(response => response.json())
      .then(data => {
        setCollection(data);
        console.log('Fetched collections:', data);
      })
      .catch(error => console.error('Error fetching collections:', error));
      
  }, []);
  return (

    <div className="md:container md:mx-auto px-4">
      <div className="font-bold lg:text-[5rem] sm:text-[3rem] text-[2rem]">{collection?.name}</div>
      <div className="lg:text-[1rem] sm:text-[0.875rem] text-[0.75rem]">{collection?.description}</div>
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] sm:text-[0.875rem] text-[0.75rem]">Title</TableHead>
          <TableHead className="sm:text-[0.875rem] text-[0.75rem]">Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {collection?.links?.map((link: Link) => (
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
