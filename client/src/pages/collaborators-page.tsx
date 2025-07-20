import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import SOSModal from "@/components/modals/sos-modal";
import ProfessionalCard from "@/components/professionals/professional-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Professional } from "@/types";

export default function CollaboratorsPage() {
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("any");

  // Sample professionals data
  const professionals: Professional[] = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      title: "Clinical Psychologist",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rating: 4.8,
      reviewCount: 123,
      specialties: ["Anxiety", "Depression", "Work Stress"],
      description: "Specializes in anxiety, depression, and workplace stress. 10+ years of experience.",
      tags: ["Anxiety", "Depression", "Work Stress"]
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      title: "Psychiatrist",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rating: 5.0,
      reviewCount: 87,
      specialties: ["Medication Mgmt", "ADHD", "Mood Disorders"],
      description: "Specializes in medication management for depression, anxiety, and ADHD.",
      tags: ["Medication Mgmt", "ADHD", "Mood Disorders"]
    },
    {
      id: "3",
      name: "Lisa Rodriguez, LMFT",
      title: "Family Therapist",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rating: 4.2,
      reviewCount: 56,
      specialties: ["Relationships", "Family", "Life Changes"],
      description: "Specializes in relationship issues, family conflicts, and life transitions.",
      tags: ["Relationships", "Family", "Life Changes"]
    }
  ];

  // Filter professionals based on search and filters
  const filteredProfessionals = professionals.filter((professional) => {
    const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        professional.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        professional.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = specialtyFilter === "all" || 
                          professional.specialties.some(s => s.toLowerCase() === specialtyFilter.toLowerCase());
    
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar onSOSClick={() => setIsSOSModalOpen(true)} />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-neutral-800 mb-2">Mental Health Professionals</h1>
          <p className="text-neutral-600">Connect with licensed therapists and counselors for professional support.</p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input 
                  type="text" 
                  placeholder="Search professionals..." 
                  className="w-full pl-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="anxiety">Anxiety</SelectItem>
                  <SelectItem value="depression">Depression</SelectItem>
                  <SelectItem value="work stress">Stress Management</SelectItem>
                  <SelectItem value="relationships">Relationships</SelectItem>
                  <SelectItem value="trauma">Trauma</SelectItem>
                </SelectContent>
              </Select>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Time</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="next-week">Next Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((professional) => (
            <ProfessionalCard key={professional.id} professional={professional} />
          ))}
          
          {filteredProfessionals.length === 0 && (
            <div className="col-span-full text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-neutral-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-neutral-600 mb-1">No professionals found</h3>
              <p className="text-neutral-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>

      <SOSModal isOpen={isSOSModalOpen} onClose={() => setIsSOSModalOpen(false)} />
    </div>
  );
}
