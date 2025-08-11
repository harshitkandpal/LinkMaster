import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {useState, useEffect} from "react"

interface Collection {
  id: number;
  name: string;
  links: Link[] | [];
  description: string;
}

interface Link {
  id: number;
  url: string;
  title: string;
  description: string;
}


export const Dashboard: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]|null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/collections/')
      .then(response => response.json())
      .then(data => {
        setCollections(data);
        console.log('Fetched collections:', data);
      })
      .catch(error => console.error('Error fetching collections:', error));
      
  }, []);



  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          {/* <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>October 2024</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> */}
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-5">
            
            {collections ? (
              collections.map((collection) => (
                <div key={collection.id} className="bg-card p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold">{collection.name}</h2>
                  <p className="text-sm text-muted-foreground">{collection.description}</p>
                  <ul className="mt-2">
                    {collection.links.map((link) => (
                      <li key={link.id} className="text-sm">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p>Loading collections...</p>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
