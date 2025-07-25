/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Github,
  Linkedin,
  Globe,
  User,
  Loader2,
  ClipboardSignature,
} from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const MailPage = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    companyType: "",
    company: "",
    position: "",
    skills: [] as string[],
    quality1: "",
    quality2: "",
    github: "",
    portfolio: "",
    linkedin: "",
  });
  const [skillsInput, setSkillsInput] = useState("");
  const [open, setOpen] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState("");

  const handleChange = (field: string, value: string) => {
    if (field === "skills") {
      const skillArray = value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      setForm((prev) => ({
        ...prev,
        skills: skillArray,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      companyType: "",
      company: "",
      position: "",
      skills: [],
      quality1: "",
      quality2: "",
      github: "",
      portfolio: "",
      linkedin: "",
    });
    setSkillsInput("");
  };

  const handleSubmit = async () => {
    setLoading(true);

    const skillArray = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      ...form,
      skills: skillArray,
    };

    try {
      const res = await fetch("/api/mail-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to generate email");

      setLoading(false);

      setGeneratedEmail(data.email);
      setOpen(true);
    } catch (err: any) {
      console.error("Error:", err);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-6">
      <Card className="w-full max-w-6xl p-6 bg-background rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            📨 Submit Your Info
          </h2>
          <Link href="/">
            <Button className="text-muted-foreground bg-background hover:text-foreground hover:bg-background text-xl cursor-pointer">
              ✕
            </Button>
          </Link>
        </div>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            id="name"
            label="Your Name"
            icon={<User size={16} />}
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <FormField
            id="company"
            label="Company Name"
            icon={<User size={16} />}
            value={form.company}
            onChange={(e) => handleChange("company", e.target.value)}
          />
          <FormField
            id="company-type"
            label="Company Type"
            icon={<ClipboardSignature size={16} />}
            value={form.companyType}
            onChange={(e) => handleChange("companyType", e.target.value)}
          />
          <FormField
            id="position"
            label="Position Offered"
            icon={<ClipboardSignature size={16} />}
            value={form.position}
            onChange={(e) => handleChange("position", e.target.value)}
          />
          <TextareaField
            id="quality1"
            label="Quality 1"
            value={form.quality1}
            onChange={(e) => handleChange("quality1", e.target.value)}
          />
          <FormField
            id="skills"
            label="Your Skills"
            icon={<ClipboardSignature size={16} />}
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            type="text"
          />

          <TextareaField
            id="quality2"
            label="Quality 2"
            value={form.quality2}
            onChange={(e) => handleChange("quality2", e.target.value)}
          />
          <FormField
            id="github"
            label="GitHub Profile"
            icon={<Github size={16} />}
            value={form.github}
            onChange={(e) => handleChange("github", e.target.value)}
          />
          <FormField
            id="portfolio"
            label="Portfolio Link"
            icon={<Globe size={16} />}
            value={form.portfolio}
            onChange={(e) => handleChange("portfolio", e.target.value)}
          />
          <FormField
            id="linkedin"
            label="LinkedIn Profile"
            icon={<Linkedin size={16} />}
            value={form.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
          />
        </CardContent>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
          <Button
            variant="outline"
            className="w-full sm:w-auto cursor-pointer"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            className="w-full sm:w-auto cursor-pointer"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Submitting...
              </>
            ) : (
              "Submit Details"
            )}
          </Button>
        </div>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Generated Cold Email 📧</DialogTitle>
            <DialogDescription className="mt-2 max-h-80 overflow-y-auto whitespace-pre-wrap">
              {generatedEmail}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(generatedEmail);

                setOpen(false);
                setTimeout(() => {
                  toast("Copied to clipboard!");
                  setTimeout(() => {
                    toast("Thank you for using this!");
                    setTimeout(() => {
                      window.location.href = "/";
                    }, 1000);
                  }, 1500);
                }, 300);
              }}
            >
              📋 Copy to Clipboard
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                window.location.href = "/";
              }}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

type FormFieldProps = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

function FormField({
  id,
  label,
  icon,
  value,
  onChange,
  type = "text",
}: FormFieldProps) {
  return (
    <div>
      <Label htmlFor={id} className="text-muted-foreground">
        {label}
      </Label>
      <div className="mt-2 flex items-center gap-2 border rounded-md px-3 py-2 bg-background">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="border-none bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}

type TextareaFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

function TextareaField({ id, label, value, onChange }: TextareaFieldProps) {
  return (
    <div>
      <Label htmlFor={id} className="text-muted-foreground">
        {label}
      </Label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={`Write about ${label.toLowerCase()}`}
        className="mt-2 w-full p-2 h-24 border rounded-md text-sm text-foreground bg-background resize-none"
      />
    </div>
  );
}

export default MailPage;
