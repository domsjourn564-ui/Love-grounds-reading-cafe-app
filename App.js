// File: App.js
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Clock, BookOpen, User, QrCode, BarChart3, CreditCard } from "lucide-react";

// ===== Supabase Setup =====
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "YOUR_SUPABASE_URL";   // Replace this
const supabaseKey = "YOUR_SUPABASE_ANON_KEY"; // Replace this
const supabase = createClient(supabaseUrl, supabaseKey);

// ===== App Data =====
const genres = ["Romance", "Self-Help", "Fiction", "Thriller", "Fantasy", "Business"];
const sampleBooks = [
  { title: "Love & Coffee", genre: "Romance" },
  { title: "Atomic Habits", genre: "Self-Help" },
  { title: "The Silent Patient", genre: "Thriller" },
  { title: "Rich Dad Poor Dad", genre: "Business" },
  { title: "The Hobbit", genre: "Fantasy" },
  { title: "The Great Gatsby", genre: "Fiction" }
];

export default function LoveGroundsReadingApp() {
  const [minutes, setMinutes] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [membership, setMembership] = useState("Bronze");
  const [selectedGenre, setSelectedGenre] = useState("Romance");
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [activeTab, setActiveTab] = useState("user");

  // ===== Timer =====
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setMinutes((prev) => prev + 1);
      }, 60000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  // ===== Book Recommendations =====
  const recommendations = useMemo(() => sampleBooks.filter((book) => book.genre === selectedGenre), [selectedGenre]);

  // ===== Add Member =====
  const handleAddMember = async () => {
    if (!memberName) return alert("Enter member name");
    const { data, error } = await supabase.from("members").insert([{ name: memberName, plan: membership, minutes_read: 0 }]);
    if (error) alert(error.message);
    else {
      setMembers([...members, { name: memberName, plan: membership, minutes_read: 0 }]);
      setMemberName("");
      alert("Member added successfully!");
    }
  };

  // ===== Admin Stats =====
  const totalMembers = members.length;
  const totalMinutes = members.reduce((acc, m) => acc + m.minutes_read, 0);

  return (
    <div className="min-h-screen bg-neutral-100 p-6 grid gap-6">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-center">
        Love Grounds Reading App
      </motion.h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4">
        <Button onClick={() => setActiveTab("user")}>User App</Button>
        <Button onClick={() => setActiveTab("admin")}>Admin Dashboard</Button>
      </div>

      {activeTab === "user" && (
        <>
          {/* Reading Timer */}
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6 flex flex-col items-center gap-4">
              <Clock size={32} />
              <h2 className="text-xl font-semibold">Reading Time Tracker</h2>
              <p className="text-lg">{minutes} minutes</p>
              <div className="flex gap-4">
                <Button onClick={() => setIsRunning(true)}>Start</Button>
                <Button onClick={() => setIsRunning(false)}>Pause</Button>
                <Button onClick={() => setMinutes(0)}>Reset</Button>
              </div>
            </CardContent>
          </Card>

          {/* Membership & Payment */}
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <User />
                <h2 className="text-xl font-semibold">Digital Membership</h2>
              </div>
              <Input placeholder="Enter Member Name" value={memberName} onChange={(e) => setMemberName(e.target.value)} />
              <Select value={membership} onValueChange={setMembership}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Membership" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bronze">Bronze</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddMember} className="flex gap-2">
                <CreditCard size={18} /> Subscribe & Pay
              </Button>
            </CardContent>
          </Card>

          {/* QR Check-In */}
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6 flex flex-col items-center gap-4">
              <QrCode size={32} />
              <h2 className="text-xl font-semibold">QR Check-In</h2>
              <p>Scan this QR at café branch to start reading session.</p>
              <div className="w-32 h-32 bg-white rounded-xl shadow flex items-center justify-center">QR</div>
            </CardContent>
          </Card>

          {/* Book Recommendations */}
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <BookOpen />
                <h2 className="text-xl font-semibold">Book Recommendations</h2>
              </div>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid gap-3">
                {recommendations.map((book, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-white rounded-xl shadow">
                    {book.title}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Admin Dashboard */}
      {activeTab === "admin" && (
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <BarChart3 />
              <h2 className="text-xl font-semibold">Admin Dashboard</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl shadow">
                <p className="text-sm">Total Members</p>
                <p className="text-2xl font-bold">{totalMembers}</p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow">
                <p className="text-sm">Total Reading Minutes</p>
                <p className="text-2xl font-bold">{totalMinutes}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Member List</h3>
              {members.map((m, i) => (
                <div key={i} className="p-3 bg-neutral-50 rounded-lg mb-2">
                  {m.name} - {m.plan} - {m.minutes_read} min
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
);
}