"use client";
import React from "react";
import {
  ClipboardIcon,
  CircleIcon,
  PlusCircledIcon,
  PersonIcon,
  StackIcon,
} from "@radix-ui/react-icons";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";

export const SidebarRoutes = () => {
  const { status } = useAuth();
  const isAdmin = status === "Admin";

  const navigate = useNavigate();
  const { pathname } = useLocation();
  type RouteType = {
    title: string;
    href?: string;
    icon: React.JSX.Element;
    label: string;
    isTitle: boolean;
    children?: {
      title: string;
      label: string;
      href: string;
      parentKey: string;
      icon: React.JSX.Element;
    }[];
  };

  const adminRoutes: RouteType[] = [
    {
      title: "Penalty Configuration",
      label: "Penalty Configuration",
      isTitle: false,
      icon: <StackIcon />,
      children: [
        {
          title: "New Penalty",
          label: "New Penalty",
          href: "/dash/penalties/new",
          parentKey: "Penalty Configuration",
          icon: <PlusCircledIcon />,
        },
        {
          title: "Penalty List",
          label: "Penalty List",
          href: "/dash/penalties",
          parentKey: "Penalty Configuration",
          icon: <CircleIcon />,
        },
      ],
    },
    {
      title: "Employee",
      label: "Employee",
      isTitle: false,
      icon: <PersonIcon />,
      children: [
        {
          title: "NewEmployee",
          label: "New Employee",
          href: "/dash/users/new",
          parentKey: "Employee",
          icon: <PersonIcon />,
        },
        {
          title: "Employee List",
          label: "Employee List",
          href: "/dash/users",
          parentKey: "Employee",
          icon: <CircleIcon />,
        },
      ],
    },
  ];

  const commonRoutes: RouteType[] = [
    {
      title: "Dashboard",
      label: "Dashboard",
      href: "/dash",
      isTitle: false,
      icon: <ClipboardIcon />,
    },

    {
      title: "Penalty Issuance",
      label: "Penalty Issuance",
      isTitle: false,
      icon: <StackIcon />,
      children: [
        {
          title: "Issue New Penalty",
          label: "Issue New Penalty",
          href: "/dash/projects/new",
          parentKey: "Projects",
          icon: <PlusCircledIcon />,
        },
        {
          title: "Penalty List",
          label: "Penalty List",
          href: "/dash/projects",
          parentKey: "Projects",
          icon: <CircleIcon />,
        },
      ],
    },
  ];

  const routes = isAdmin ? [...commonRoutes, ...adminRoutes] : commonRoutes;

  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList className="flex flex-col gap-2">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          if (route.children && route.children.length > 0) {
            return (
              <Accordion
                className="w-full"
                type="single"
                collapsible
                key={route.title}
              >
                <AccordionItem value={route.title}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-1">
                      {route.icon}
                      {route.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {route.children.map((child) => {
                      const isSubActive = pathname === child.href;
                      return (
                        <div
                          key={child.title}
                          onClick={() => navigate(child.href)}
                          className="w-full cursor-pointer"
                        >
                          <NavigationMenuItem className="w-full">
                            <NavigationMenuLink
                              className={cn(
                                navigationMenuTriggerStyle(),
                                "flex justify-start gap-2 w-full cursor-pointer text-opacity-50",
                                isSubActive && "text-opacity-100 bg-clicked"
                              )}
                            >
                              {child.icon}
                              {child.title}
                            </NavigationMenuLink>
                          </NavigationMenuItem>
                        </div>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          } else {
            return (
              <div
                key={route.title}
                onClick={() => navigate(route.href!)}
                className="w-full cursor-pointer"
              >
                <NavigationMenuItem className="w-full">
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "flex justify-start gap-2 w-full cursor-pointer text-opacity-50",
                      isActive && "text-opacity-100 bg-clicked"
                    )}
                  >
                    {route.icon}
                    {route.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </div>
            );
          }
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
