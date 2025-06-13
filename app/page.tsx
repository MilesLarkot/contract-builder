"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UserStoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const userStories = [
    {
      id: "US-001",
      storyTitle: "Create Contract from Template",
      userStory:
        "As a Contract Manager, I want to create a new contract using a template so that I can quickly draft a standardized agreement",
      acceptanceCriteria: [
        "Navigate to Templates page",
        "Select a template (e.g., Service Agreement)",
        "Redirect to Contract Editor with template preloaded",
        "Template fields and sections are populated",
        "Save contract with a unique title",
      ],
      suggestions: [
        "Add a confirmation dialog before creating a new contract",
        "Support template previews before selection",
        "Allow importing templates from external sources (e.g., JSON)",
      ],
      status: "Finished",
    },
    {
      id: "US-002",
      storyTitle: "Edit Contract Content",
      userStory:
        "As a Contract Manager, I want to edit contract content with a rich text editor so that I can format and customize the agreement",
      acceptanceCriteria: [
        "Access Contract Editor in 'details' tab",
        "Use Tiptap editor to apply formatting (e.g., headings, lists, bold)",
        "Add placeholders for fields (e.g., `<span>party1</span>`)",
        "Changes are reflected in real-time",
        "Content is saved automatically after 5 seconds",
      ],
      suggestions: [
        "Add undo/redo functionality to the editor",
        "Implement a version history for tracking changes",
        "Support inline field insertion via a dropdown menu",
      ],
      status: "Finished",
    },
    {
      id: "US-003",
      storyTitle: "Manage Contract Fields",
      userStory:
        "As a Contract Manager, I want to add and manage fields in a contract so that I can define dynamic data points like dates or amounts",
      acceptanceCriteria: [
        "Open Contract Sidebar or Modal",
        "Add a new field with name, type (e.g., text, date), and required status",
        "Edit or remove existing fields",
        "Suggested fields (e.g., effectiveDate) can be added",
        "Fields are listed in Sidebar/Modal",
      ],
      suggestions: [
        "Validate field names for uniqueness",
        "Support field validation rules (e.g., regex for emails)",
        "Allow reordering fields via drag-and-drop",
      ],
      status: "Finished",
    },
    {
      id: "US-004",
      storyTitle: "Add Predefined Sections",
      userStory:
        "As a Contract Manager, I want to add predefined sections to a contract so that I can include standard clauses without manual entry",
      acceptanceCriteria: [
        "Access 'sections' tab in Sidebar/Modal",
        "View available sections (e.g., Introduction)",
        "Add a section to the contract",
        "Section content with placeholders is inserted into editor",
        "Associated fields are added to contract fields",
      ],
      suggestions: [
        "Support section templates with customizable fields",
        "Add a search bar for sections in the Sidebar/Modal",
        "Allow previewing section content before adding",
      ],
      status: "Finished",
    },
    {
      id: "US-005",
      storyTitle: "Manage Contract Parties",
      userStory:
        "As a Contract Manager, I want to manage parties involved in a contract so that I can specify companies or individuals and their details",
      acceptanceCriteria: [
        "Access 'parties' tab in Sidebar/Modal",
        "Add a new party with name and type (company/individual)",
        "Add custom fields to a party (e.g., email)",
        "Edit or remove party fields",
        "Remove a party if no longer needed",
      ],
      suggestions: [
        "Auto-suggest party names from a database or previous contracts",
        "Support bulk import of parties via CSV",
        "Add validation for required party fields",
      ],
      status: "Finished",
    },
    {
      id: "US-006",
      storyTitle: "Preview Contract",
      userStory:
        "As a Contract Manager, I want to preview a contract with filled placeholders so that I can see how the final agreement will look",
      acceptanceCriteria: [
        "Switch to 'preview' tab in Contract Editor",
        "View contract with placeholders replaced by field values",
        "Unfilled placeholders are highlighted (blue background)",
        "Preview reflects current editor content",
      ],
      suggestions: [
        "Add a toggle to show/hide placeholder highlights",
        "Support a print-friendly preview mode",
        "Allow side-by-side comparison of editor and preview",
      ],
      status: "Finished",
    },
    {
      id: "US-007",
      storyTitle: "Export Contract to PDF",
      userStory:
        "As a Contract Manager, I want to export a contract to PDF so that I can share or store the agreement externally",
      acceptanceCriteria: [
        "In 'preview' tab, click 'Export to PDF'",
        "PDF is generated with contract content",
        "Error is shown if placeholders are unfilled",
        "PDF is downloaded with a filename based on contract title",
      ],
      suggestions: [
        "Support additional export formats (e.g., DOCX)",
        "Allow customizing PDF layout (e.g., headers, footers)",
        "Add a progress indicator for PDF generation",
      ],
      status: "Finished",
    },
    {
      id: "US-008",
      storyTitle: "View and Filter Contracts",
      userStory:
        "As an Administrator, I want to view and filter all contracts so that I can manage and track agreements efficiently",
      acceptanceCriteria: [
        "Navigate to Contracts page",
        "View list of contracts with title, status, parties, value, dates",
        "Filter by status (active, pending, draft, expired)",
        "Search by title or parties",
        "Table updates dynamically based on filters",
      ],
      suggestions: [
        "Add sorting options for columns (e.g., by created date)",
        "Support advanced filters (e.g., by value range)",
        "Implement pagination for large contract lists",
      ],
      status: "Finished",
    },
    {
      id: "US-009",
      storyTitle: "Perform Contract Actions",
      userStory:
        "As an Administrator, I want to perform actions on a contract so that I can edit, duplicate, or archive agreements",
      acceptanceCriteria: [
        "Click actions menu on a contract row",
        "Options include View, Edit, Duplicate, Export PDF, Archive, Delete",
        "Edit redirects to Contract Editor",
        "Duplicate creates a new contract with same content",
      ],
      suggestions: [
        "Add confirmation dialogs for destructive actions (e.g., Delete)",
        "Support batch actions for multiple contracts",
        "Implement an audit log for contract actions",
      ],
      status: "Working On",
    },
    {
      id: "US-010",
      storyTitle: "Browse Contract Templates",
      userStory:
        "As a Legal Team Member, I want to browse and select contract templates so that I can use pre-approved templates for new contracts",
      acceptanceCriteria: [
        "Navigate to Templates page",
        "View templates with title, description, category, usage count",
        "Filter by category (e.g., service, NDA)",
        "Search by title, description, or tags",
        "Select 'Use Template' to start new contract",
      ],
      suggestions: [
        "Add a template rating system for user feedback",
        "Support template versioning",
        "Allow previewing template content in a modal",
      ],
      status: "Finished",
    },
    {
      id: "US-011",
      storyTitle: "Create New Template",
      userStory:
        "As a Legal Team Member, I want to create a new template so that I can standardize agreements for future use",
      acceptanceCriteria: [
        "Click 'New Template' on Templates page",
        "Redirect to Contract Editor in 'template' mode",
        "Define title, content, fields, sections, and parties",
        "Save template for reuse",
        "Template appears in Templates page",
      ],
      suggestions: [
        "Add a template approval workflow",
        "Support template categories during creation",
        "Allow importing existing contracts as templates",
      ],
      status: "Finished",
    },
    {
      id: "US-012",
      storyTitle: "Favorite a Template",
      userStory:
        "As a Legal Team Member, I want to favorite a template so that I can quickly access frequently used templates",
      acceptanceCriteria: [
        "Click star icon on a template card",
        "Template is marked as favorite",
        "Favorites count updates in dashboard",
        "Favorite templates remain accessible after page refresh",
      ],
      suggestions: [
        "Add a dedicated 'Favorites' tab on Templates page",
        "Support favoriting via keyboard shortcut",
        "Allow reordering favorite templates",
      ],
      status: "Working On",
    },
  ];

  const filteredUserStories = userStories.filter(
    (story) =>
      story.storyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.userStory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finished":
        return "bg-green-100 text-green-800";
      case "Working On":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 sm:ml-[320px] w-full">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Stories</h1>
            <p className="text-gray-600 mt-1">
              Overview of user stories for the contract management system
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search user stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Stories ({filteredUserStories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left font-medium text-gray-900">
                      ID
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-900">
                      Story Title
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-900">
                      User Story
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-900">
                      Acceptance Criteria
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-900">
                      Suggestions
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-900">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUserStories.map((story) => (
                    <TableRow key={story.id} className="hover:bg-gray-50">
                      <TableCell className="py-3 px-4 text-sm text-gray-600">
                        {story.id}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-sm font-medium text-gray-900">
                        {story.storyTitle}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-sm text-gray-600">
                        {story.userStory}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-sm text-gray-600">
                        <ul className="list-disc list-inside">
                          {story.acceptanceCriteria.map((criterion, index) => (
                            <li key={index}>{criterion}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-sm text-gray-600">
                        <ul className="list-disc list-inside">
                          {story.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <Badge className={getStatusColor(story.status)}>
                          {story.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {filteredUserStories.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-lg font-medium text-gray-900 mb-2">
                No user stories found
              </p>
              <p className="text-gray-600">
                Try adjusting your search criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserStoriesPage;
