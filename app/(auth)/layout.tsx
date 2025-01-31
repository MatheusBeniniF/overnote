import type { PropsWithChildren } from "react";
import { redirect, useParams } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default async function AuthLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
        />

        {/* Cabeçalho */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            {/* Breadcrumb Dinâmico */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </Link>
                </BreadcrumbItem>
                {/* <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{noteTitle}</BreadcrumbPage>
                  </BreadcrumbItem>
                </> */}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
