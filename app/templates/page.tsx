"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Download,
  Archive,
  Trash2,
  FileText,
  Star,
  Settings,
  BookOpen,
  Zap,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TemplatesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const templates = [
    {
      id: "1",
      title: "Service Agreement Template",
      description: "Comprehensive service agreement for professional services",
      category: "service",
      type: "premium",
      usageCount: 12,
      lastUsed: "2024-02-10",
      created: "2024-01-15",
      author: "Legal Team",
      rating: 4.8,
      tags: ["services", "b2b", "professional"],
      isFavorite: true,
      estimatedTime: "15 min",
    },
    {
      id: "2",
      title: "Standard NDA Template",
      description: "Non-disclosure agreement for confidential information",
      category: "nda",
      type: "standard",
      usageCount: 28,
      lastUsed: "2024-02-12",
      created: "2024-01-10",
      author: "Legal Team",
      rating: 4.9,
      tags: ["confidentiality", "nda", "standard"],
      isFavorite: true,
      estimatedTime: "10 min",
    },
    {
      id: "3",
      title: "Employment Contract Template",
      description: "Standard employment agreement with benefits and terms",
      category: "employment",
      type: "standard",
      usageCount: 8,
      lastUsed: "2024-02-08",
      created: "2024-01-20",
      author: "HR Department",
      rating: 4.6,
      tags: ["employment", "hr", "full-time"],
      isFavorite: false,
      estimatedTime: "20 min",
    },
    {
      id: "4",
      title: "Vendor Agreement Template",
      description: "Agreement template for vendor and supplier relationships",
      category: "vendor",
      type: "standard",
      usageCount: 15,
      lastUsed: "2024-02-05",
      created: "2024-01-12",
      author: "Procurement Team",
      rating: 4.4,
      tags: ["vendor", "supplier", "procurement"],
      isFavorite: false,
      estimatedTime: "12 min",
    },
    {
      id: "5",
      title: "Consulting Agreement Template",
      description: "Professional consulting services agreement",
      category: "service",
      type: "premium",
      usageCount: 6,
      lastUsed: "2024-02-01",
      created: "2024-01-25",
      author: "Legal Team",
      rating: 4.7,
      tags: ["consulting", "professional", "hourly"],
      isFavorite: false,
      estimatedTime: "18 min",
    },
    {
      id: "6",
      title: "Partnership Agreement Template",
      description:
        "Comprehensive partnership agreement for business partnerships",
      category: "partnership",
      type: "premium",
      usageCount: 3,
      lastUsed: "2024-01-28",
      created: "2024-01-22",
      author: "Legal Team",
      rating: 4.5,
      tags: ["partnership", "business", "equity"],
      isFavorite: true,
      estimatedTime: "25 min",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "premium":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "standard":
        return <FileText className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "premium":
        return "bg-yellow-100 text-yellow-800";
      case "standard":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const categoryCounts = {
    all: templates.length,
    service: templates.filter((t) => t.category === "service").length,
    nda: templates.filter((t) => t.category === "nda").length,
    employment: templates.filter((t) => t.category === "employment").length,
    vendor: templates.filter((t) => t.category === "vendor").length,
    partnership: templates.filter((t) => t.category === "partnership").length,
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const favoriteTemplates = templates.filter((t) => t.isFavorite);

  return (
    <div className="min-h-screen bg-gray-50 sm:ml-[320px] w-full">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
            <p className="text-gray-600 mt-1">
              Create and manage contract templates
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Template Settings
            </Button>
            <Button onClick={() => (window.location.href = "/templates/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Templates
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {templates.length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Favorites</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {favoriteTemplates.length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Usage
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Rating
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {(
                      templates.reduce((sum, t) => sum + t.rating, 0) /
                      templates.length
                    ).toFixed(1)}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="service">Service Agreements</SelectItem>
              <SelectItem value="nda">NDAs</SelectItem>
              <SelectItem value="employment">Employment</SelectItem>
              <SelectItem value="vendor">Vendor Agreements</SelectItem>
              <SelectItem value="partnership">Partnerships</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        <Tabs
          value={categoryFilter}
          onValueChange={setCategoryFilter}
          className="mb-6"
        >
          <TabsList>
            <TabsTrigger value="all">All ({categoryCounts.all})</TabsTrigger>
            <TabsTrigger value="service">
              Service ({categoryCounts.service})
            </TabsTrigger>
            <TabsTrigger value="nda">NDA ({categoryCounts.nda})</TabsTrigger>
            <TabsTrigger value="employment">
              Employment ({categoryCounts.employment})
            </TabsTrigger>
            <TabsTrigger value="vendor">
              Vendor ({categoryCounts.vendor})
            </TabsTrigger>
            <TabsTrigger value="partnership">
              Partnership ({categoryCounts.partnership})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(template.type)}
                    <Badge className={getTypeColor(template.type)}>
                      {template.type.charAt(0).toUpperCase() +
                        template.type.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={template.isFavorite ? "text-yellow-500" : ""}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          template.isFavorite ? "fill-current" : ""
                        }`}
                      />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardTitle className="text-lg">{template.title}</CardTitle>
                <p className="text-sm text-gray-600">{template.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs px-2 py-0.5"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Usage Count</p>
                      <p className="font-medium">{template.usageCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current text-yellow-400" />
                        <span className="font-medium">{template.rating}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">Est. Time</p>
                      <p className="font-medium">{template.estimatedTime}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Used</p>
                      <p className="font-medium">{template.lastUsed}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1"
                      size="sm"
                      onClick={() => (window.location.href = "/contracts/new")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No templates found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => (window.location.href = "/templates/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Template
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;
