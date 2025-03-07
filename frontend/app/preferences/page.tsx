"use client"; 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PreferencesPage() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [email, setEmail] = useState<string | null>(null);

  // Available news categories
  const categories = ["Travel", "Technology", "Finance", "Health", "Sports", "Entertainment"];

  // Get user email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (!storedEmail) {
      alert("User email not found! Redirecting to login...");
      router.push("/login");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  // Handle checkbox change
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category) // Remove category if already selected
        : [...prev, category] // Add category if not selected
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      alert("Please select at least one category!");
      return;
    }

    if (!email) {
      alert("User email not found!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/update_preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, preferred_domains: selectedCategories }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Preferences saved successfully! Redirecting to News Section...");
        router.push("/news-home");
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Error saving preferences");
    }
  };

  return (
    <div className="min-h-screen text-white bg-[#0A0A0A] flex items-center justify-center">
      <div className="bg-gray-900/80 rounded-lg p-8 w-full max-w-md backdrop-blur-sm hover:shadow-[20px_20px_20px_-5px_rgba(14,166,233,0.3)] hover:shadow-[#0EA6E9]/30 transition-shadow duration-200">
        <h1 className="text-[#0EA6E9] text-3xl font-bold mb-6 text-center">
          Select Your News Preferences
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="form-checkbox h-5 w-5 text-[#0EA6E9] rounded focus:ring-[#0EA6E9] border-gray-700"
                />
                <span className="text-gray-300 hover:text-gray-100 transition-colors duration-200">
                  {category}
                </span>
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-[#0EA6E9] text-white py-2 px-4 rounded-lg hover:bg-[#809fff] transition-colors duration-200"
          >
            Save Preferences & Continue
          </button>
        </form>
      </div>
    </div>
  );
}
