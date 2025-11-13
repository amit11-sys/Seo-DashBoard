// "use client";

// import React, { useState, useCallback } from "react";
// import dynamic from "next/dynamic";
// import { Button } from "@/components/ui/button";
// import { Paperclip, Smile, Upload } from "lucide-react";
// import { toast } from "sonner";

// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import "react-quill/dist/quill.snow.css";

// interface RichTextAreaProps {
//   value?: string;
//   onChange: (value: string) => void;
//   onFileUpload?: (file: File) => Promise<string>; // return uploaded URL
//   placeholder?: string;
//   className?: string;
// }

// export default function RichTextArea({
//   value = "",
//   onChange,
//   onFileUpload,
//   placeholder = "Write comments...",
//   className = "",
// }: any) {
//   const [uploading, setUploading] = useState(false);

//   // 🧩 Quill toolbar setup
//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, false] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["link", "blockquote", "code-block"],
//       [{ align: [] }],
//       ["clean"],
//     ],
//   };

//   const handleFileSelect = useCallback(
//     async (e: React.ChangeEvent<HTMLInputElement>) => {
//       const file = e.target.files?.[0];
//       if (!file || !onFileUpload) return;
//       setUploading(true);
//       try {
//         const url = await onFileUpload(file);
//         onChange(value + `<p><a href="${url}" target="_blank">${file.name}</a></p>`);
//         toast.success("File uploaded!");
//       } catch (err) {
//         toast.error("File upload failed");
//       } finally {
//         setUploading(false);
//       }
//     },
//     [onChange, value, onFileUpload]
//   );

//   // 🖱 Handle paste/drop file upload
//   const handleDrop = useCallback(
//     async (e: React.DragEvent<HTMLDivElement>) => {
//       e.preventDefault();
//       const file = e.dataTransfer.files?.[0];
//       if (!file || !onFileUpload) return;
//       setUploading(true);
//       try {
//         const url = await onFileUpload(file);
//         onChange(value + `<p><a href="${url}" target="_blank">${file.name}</a></p>`);
//         toast.success("File uploaded!");
//       } catch {
//         toast.error("File upload failed");
//       } finally {
//         setUploading(false);
//       }
//     },
//     [onChange, value, onFileUpload]
//   );

//   return (
//     <div
//       className={`border rounded-2xl shadow-sm p-2 bg-white ${className}`}
//       onDrop={handleDrop}
//       onDragOver={(e) => e.preventDefault()}
//     >
//       <ReactQuill
//         value={value}
//         onChange={onChange}
//         modules={modules}
//         placeholder={placeholder}
//         className="min-h-[150px]"
//       />
//       <div className="flex justify-between items-center mt-2 px-2">
//         <div className="flex items-center gap-2">
//           <label className="cursor-pointer">
//             <Paperclip size={18} />
//             <input
//               type="file"
//               className="hidden"
//               onChange={handleFileSelect}
//               disabled={uploading}
//             />
//           </label>
//           <Smile size={18} className="cursor-pointer" />
//         </div>
//         <Button size="sm" disabled={uploading}>
//           {uploading ? "Uploading..." : <Upload size={16} />}
//         </Button>
//       </div>
//     </div>
//   );
// }




// "use client";

// import React, { useRef, useState, useCallback } from "react";
// import { Paperclip, Smile, Upload } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// interface RichTextAreaProps {
//   value: string;
//   onChange: (e: { target: { value: string } }) => void;
//   onFileUpload?: (file: File) => any;
//   onBlur?: () => void;
//   autoFocus?: boolean;
//   placeholder?: string;
//   className?: string;
// }

// export default function RichTextArea({
//   value,
//   onChange,
//   onFileUpload,
//   onBlur,
//   autoFocus = false,
//   placeholder = "Write something...",
//   className = "",
// }: RichTextAreaProps) {
//   const [uploading, setUploading] = useState(false);
//   const inputRef = useRef<HTMLTextAreaElement>(null);

//   // Handle file select (from icon)
//   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !onFileUpload) return;

//     setUploading(true);
//     try {
//       const url = await onFileUpload(file);
//       onChange({
//         target: {
//           value: value
//             ? `${value}\n[${file.name}](${url})`
//             : `[${file.name}](${url})`,
//         },
//       });
//       toast.success("File uploaded!");
//     } catch {
//       toast.error("File upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Handle paste (copy–paste file)
//   const handlePaste = useCallback(
//     async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
//       if (!onFileUpload) return;

//       const file = e.clipboardData.files?.[0];
//       if (!file) return;

//       e.preventDefault();
//       setUploading(true);
//       try {
//         const url = await onFileUpload(file);
//         onChange({
//           target: {
//             value:
//               value + `\n[${file.name}](${url})`, // markdown style link
//           },
//         });
//         toast.success("File pasted and uploaded!");
//       } catch {
//         toast.error("Paste upload failed");
//       } finally {
//         setUploading(false);
//       }
//     },
//     [value, onChange, onFileUpload]
//   );

//   // Handle drag–drop
//   const handleDrop = useCallback(
//     async (e: React.DragEvent<HTMLDivElement>) => {
//       e.preventDefault();
//       if (!onFileUpload) return;

//       const file = e.dataTransfer.files?.[0];
//       if (!file) return;

//       setUploading(true);
//       try {
//         const url = await onFileUpload(file);
//         onChange({
//           target: {
//             value:
//               value + `\n[${file.name}](${url})`,
//           },
//         });
//         toast.success("File uploaded!");
//       } catch {
//         toast.error("Drop upload failed");
//       } finally {
//         setUploading(false);
//       }
//     },
//     [value, onChange, onFileUpload]
//   );

//   return (
//     <div
//       className={`relative border rounded-xl bg-white shadow-sm p-2 flex flex-col ${className}`}
//       onDrop={handleDrop}
//       onDragOver={(e) => e.preventDefault()}
//     >
//       <textarea
//         ref={inputRef}
//         value={value}
//         onChange={onChange}
//         onBlur={onBlur}
//         onPaste={handlePaste}
//         autoFocus={autoFocus}
//         placeholder={placeholder}
//         className="w-full min-h-[120px] resize-none outline-none bg-transparent p-2 text-gray-800 font-medium"
//       />

//       <div className="flex items-center justify-between mt-1 px-2">
//         <div className="flex items-center gap-3">
//           <label className="cursor-pointer text-gray-600 hover:text-gray-900">
//             <Paperclip size={18} />
//             <input
//               type="file"
//               className="hidden"
//               onChange={handleFileSelect}
//               disabled={uploading}
//             />
//           </label>
//           <Smile
//             size={18}
//             className="cursor-pointer text-gray-600 hover:text-gray-900"
//             // title="Add emoji"
//           />
//         </div>
//         <Button
//           type="button"
//           size="sm"
//           disabled={uploading}
//           className="text-sm"
//         >
//           {uploading ? "Uploading..." : <Upload size={16} />}
//         </Button>
//       </div>
//     </div>
//   );
// }









// "use client";

// import React, { useRef, useState, useCallback } from "react";
// import {
//   Bold,
//   Italic,
//   Underline,
//   List,
//   Heading,
//   Paperclip,
//   Smile,
//   Upload,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// interface RichTextAreaProps {
//   value: string;
//   onChange: (e: { target: { value: string } }) => void;
//   onFileUpload?: (file: File) => Promise<string>;
//   onBlur?: () => void;
//   autoFocus?: boolean;
//   placeholder?: string;
//   className?: string;
// }

// export default function RichTextArea({
//   value,
//   onChange,
//   onFileUpload,
//   onBlur,
//   autoFocus = false,
//   placeholder = "Write something...",
//   className = "",
// }: RichTextAreaProps) {
//   const [uploading, setUploading] = useState(false);
//   const inputRef = useRef<HTMLTextAreaElement>(null);

//   // ✏️ Insert markdown around selected text
//   const insertMarkdown = (syntax: string, closingSyntax?: string) => {
//     const textarea = inputRef.current;
//     if (!textarea) return;
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selectedText = textarea.value.substring(start, end);
//     const newText =
//       textarea.value.substring(0, start) +
//       syntax +
//       selectedText +
//       (closingSyntax ?? syntax) +
//       textarea.value.substring(end);
//     onChange({ target: { value: newText } });
//     textarea.focus();
//   };

//   // 📎 File select
//   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !onFileUpload) return;
//     setUploading(true);
//     try {
//       const url = await onFileUpload(file);
//       onChange({
//         target: {
//           value: value
//             ? `${value}\n[${file.name}](${url})`
//             : `[${file.name}](${url})`,
//         },
//       });
//       toast.success("File uploaded!");
//     } catch {
//       toast.error("File upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // 📋 Paste file
//   const handlePaste = useCallback(
//     async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
//       if (!onFileUpload) return;
//       const file = e.clipboardData.files?.[0];
//       if (!file) return;
//       e.preventDefault();
//       setUploading(true);
//       try {
//         const url = await onFileUpload(file);
//         onChange({
//           target: {
//             value: value + `\n[${file.name}](${url})`,
//           },
//         });
//         toast.success("File pasted & uploaded!");
//       } catch {
//         toast.error("Paste upload failed");
//       } finally {
//         setUploading(false);
//       }
//     },
//     [value, onChange, onFileUpload]
//   );

//   // 🖱️ Drag–drop upload
//   const handleDrop = useCallback(
//     async (e: React.DragEvent<HTMLDivElement>) => {
//       e.preventDefault();
//       if (!onFileUpload) return;
//       const file = e.dataTransfer.files?.[0];
//       if (!file) return;
//       setUploading(true);
//       try {
//         const url = await onFileUpload(file);
//         onChange({
//           target: {
//             value: value + `\n[${file.name}](${url})`,
//           },
//         });
//         toast.success("File uploaded!");
//       } catch {
//         toast.error("Drop upload failed");
//       } finally {
//         setUploading(false);
//       }
//     },
//     [value, onChange, onFileUpload]
//   );

//   return (
//     <div
//       className={`relative border rounded-xl bg-white shadow-sm p-2 flex flex-col ${className}`}
//       onDrop={handleDrop}
//       onDragOver={(e) => e.preventDefault()}
//     >
//       {/* 🧰 Toolbar */}
//       <div className="flex items-center flex-wrap gap-2 border-b border-gray-200 pb-2 mb-2 px-1">
//         <button
//           onClick={() => insertMarkdown("**")}
//           title="Bold"
//           className="p-1 text-gray-600 hover:text-black"
//         >
//           <Bold size={16} />
//         </button>
//         <button
//           onClick={() => insertMarkdown("*")}
//           title="Italic"
//           className="p-1 text-gray-600 hover:text-black"
//         >
//           <Italic size={16} />
//         </button>
//         <button
//           onClick={() => insertMarkdown("__")}
//           title="Underline"
//           className="p-1 text-gray-600 hover:text-black"
//         >
//           <Underline size={16} />
//         </button>
//         <button
//           onClick={() => insertMarkdown("### ")}
//           title="Heading"
//           className="p-1 text-gray-600 hover:text-black"
//         >
//           <Heading size={16} />
//         </button>
//         <button
//           onClick={() => insertMarkdown("- ")}
//           title="Bullet List"
//           className="p-1 text-gray-600 hover:text-black"
//         >
//           <List size={16} />
//         </button>

//         <label className="cursor-pointer p-1 text-gray-600 hover:text-black">
//           <Paperclip size={16}
//         //    title="Attach File" 
//            />
//           <input
//             type="file"
//             className="hidden"
//             onChange={handleFileSelect}
//             disabled={uploading}
//           />
//         </label>

//         <Smile
//           size={16}
//           className="text-gray-600 hover:text-black cursor-pointer"
//         //   title="Add emoji"
//         />
//       </div>

//       {/* 📝 Text area */}
//       <textarea
//         ref={inputRef}
//         value={value}
//         onChange={onChange}
//         onBlur={onBlur}
//         onPaste={handlePaste}
//         autoFocus={autoFocus}
//         placeholder={placeholder}
//         className="w-full min-h-[120px] resize-none outline-none bg-transparent p-2 text-gray-800 font-medium"
//       />

//       {/* 📤 Footer */}
//       <div className="flex items-center justify-end mt-2 px-2">
//         <Button
//           type="button"
//           size="sm"
//           disabled={uploading}
//           className="text-sm"
//         >
//           {uploading ? "Uploading..." : <Upload size={16} />}
//         </Button>
//       </div>
//     </div>
//   );
// }





// "use client";

// import React, { useRef, useState, useCallback } from "react";
// import {
//   Bold,
//   Italic,
//   Underline,
//   List,
//   Heading,
//   Paperclip,
//   Smile,
//   Upload,
//   X,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// interface UploadedFile {
//   name: string;
//   url: string;
// }

// interface RichTextAreaProps {
//   value: string;
//   onChange: (e: { target: { value: string } }) => void;
//   onFileUpload?: (file: File) => Promise<string>;
//   onBlur?: () => void;
//   autoFocus?: boolean;
//   placeholder?: string;
//   className?: string;
// }

// export default function RichTextArea({
//   value,
//   onChange,
//   onFileUpload,
//   onBlur,
//   autoFocus = false,
//   placeholder = "Write something...",
//   className = "",
// }: RichTextAreaProps) {
//   const [uploading, setUploading] = useState(false);
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const inputRef = useRef<HTMLTextAreaElement>(null);

//   // ✏️ Insert markdown around selected text
//   const insertMarkdown = (syntax: string, closingSyntax?: string) => {
//     const textarea = inputRef.current;
//     if (!textarea) return;
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selectedText = textarea.value.substring(start, end);
//     const newText =
//       textarea.value.substring(0, start) +
//       syntax +
//       selectedText +
//       (closingSyntax ?? syntax) +
//       textarea.value.substring(end);
//     onChange({ target: { value: newText } });
//     textarea.focus();
//   };

//   // 🔄 Add uploaded file to preview + textarea
//   const addUploadedFile = (file: File, url: string) => {
//     const fileData = { name: file.name, url };
//     setUploadedFiles((prev) => [...prev, fileData]);

//     // Optionally append markdown text
//     onChange({
//       target: {
//         value: value
//           ? `${value}\n[${file.name}](${url})`
//           : `[${file.name}](${url})`,
//       },
//     });
//   };

//   // 📎 File select
//   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !onFileUpload) return;
//     setUploading(true);
//     try {
//       const url = await onFileUpload(file);
//       addUploadedFile(file, url);
//       toast.success("File uploaded!");
//     } catch {
//       toast.error("File upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // 📋 Paste file
//   const handlePaste = useCallback(
//     async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
//       if (!onFileUpload) return;
//       const file = e.clipboardData.files?.[0];
//       if (!file) return;
//       e.preventDefault();
//       setUploading(true);
//       try {
//         const url = await onFileUpload(file);
//         addUploadedFile(file, url);
//         toast.success("File pasted & uploaded!");
//       } catch {
//         toast.error("Paste upload failed");
//       } finally {
//         setUploading(false);
//       }
//     },
//     [value, onChange, onFileUpload]
//   );

//   // 🖱️ Drag–drop upload
//   const handleDrop = useCallback(
//     async (e: React.DragEvent<HTMLDivElement>) => {
//       e.preventDefault();
//       if (!onFileUpload) return;
//       const file = e.dataTransfer.files?.[0];
//       if (!file) return;
//       setUploading(true);
//       try {
//         const url = await onFileUpload(file);
//         addUploadedFile(file, url);
//         toast.success("File uploaded!");
//       } catch {
//         toast.error("Drop upload failed");
//       } finally {
//         setUploading(false);
//       }
//     },
//     [value, onChange, onFileUpload]
//   );

//   // ❌ Remove file from preview
//   const removeFile = (name: string) => {
//     setUploadedFiles((prev) => prev.filter((f) => f.name !== name));
//   };

//   return (
//     <div
//       className={`relative border rounded-xl bg-white shadow-sm p-2 flex flex-col ${className}`}
//       onDrop={handleDrop}
//       onDragOver={(e) => e.preventDefault()}
//     >
//       {/* 🧰 Toolbar */}
//       <div className="flex items-center flex-wrap gap-2 border-b border-gray-200 pb-2 mb-2 px-1">
//         <button
//           onClick={() => insertMarkdown("**")}
//           title="Bold"
//           className="p-1 text-gray-600 hover:text-black"
//         >
//           <Bold size={16} />
//         </button>
//         <button
//           onClick={() => insertMarkdown("*")}
//           title="Italic"
//           className="p-1 text-gray-600 hover:text-black"
//         >
//           <Italic size={16} />
//         </button>
//         <button
//           onClick={() => insertMarkdown("__")}
//           title="Underline"
//           className="p-1 text-gray-600 hover:text-black"
//         >
//           <Underline size={16} />
//         </button>
//         <button
//           onClick={() => insertMarkdown("### ")}
//           title="Heading"
//           className="p-1 text-gray-600 hover:text-black"
//         >
//           <Heading size={16} />
//         </button>
//         <button
//           onClick={() => insertMarkdown("- ")}
//           title="Bullet List"
//           className="p-1 text-gray-600 hover:text-black"
//         >
//           <List size={16} />
//         </button>

//         <label className="cursor-pointer p-1 text-gray-600 hover:text-black">
//           <Paperclip size={16} 
//           // title="Attach File" 
//           />
//           <input
//             type="file"
//             className="hidden"
//             onChange={handleFileSelect}
//             disabled={uploading}
//           />
//         </label>

//         <Smile
//           size={16}
//           className="text-gray-600 hover:text-black cursor-pointer"
//           // title="Add emoji"
//         />
//       </div>

//       {/* 📝 Text area */}
//       <textarea
//         ref={inputRef}
//         value={value}
//         onChange={onChange}
//         onBlur={onBlur}
//         onPaste={handlePaste}
//         autoFocus={autoFocus}
//         placeholder={placeholder}
//         className="w-full min-h-[120px] resize-none outline-none bg-transparent p-2 text-gray-800 font-medium"
//       />

//       {/* 🗂️ File preview container */}
//      {uploadedFiles.length > 0 && (
//   <div className="flex flex-wrap gap-2 mt-3 px-2">
//     {uploadedFiles.map((file) => (
//       <div
//         key={file.name}
//         className="flex items-center gap-2 border border-gray-300 bg-gray-50 px-3 py-1 rounded-md text-sm shadow-sm"
//       >
//         {/* 🖼️ If image, show small thumb */}
//         {file.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.url) ? (
//           <img
//             src={file.url}
//             alt={file.name}
//             className="w-6 h-6 rounded object-cover"
//           />
//         ) : (
//           <Paperclip size={14} className="text-gray-500" />
//         )}

//         <span className="truncate max-w-[120px]">{file.name}</span>
//         <button
//           type="button"
//           onClick={() => removeFile(file.name)}
//           className="text-gray-400 hover:text-red-500"
//         >
//           <X size={14} />
//         </button>
//       </div>
//     ))}
//   </div>
// )}


//       {/* 📤 Footer */}
//       <div className="flex items-center justify-end mt-2 px-2">
//         <Button
//           type="button"
//           size="sm"
//           disabled={uploading}
//           className="text-sm"
//         >
//           {uploading ? "Uploading..." : <Upload size={16} />}
//         </Button>
//       </div>
//     </div>
//   );
// }




// "use client";

// import React, { useRef, useState, useCallback } from "react";
// import {
//   Bold,
//   Italic,
//   Underline,
//   List,
//   Heading,
//   Paperclip,
//   Smile,
//   Upload,
//   X,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// interface UploadedFile {
//   name: string;
//   url: string;
// }

// interface RichTextAreaProps {
//   value: string;
//   onChange: (e: { target: { value: string } }) => void;
//   onFileUpload?: (file: File) => Promise<string>;
//   onBlur?: () => void;
//   autoFocus?: boolean;
//   placeholder?: string;
//   className?: string;
// }

// export default function RichTextArea({
//   value,
//   onChange,
//   onFileUpload,
//   onBlur,
//   autoFocus = false,
//   placeholder = "Write something...",
//   className = "",
// }: RichTextAreaProps) {
//   const [uploading, setUploading] = useState(false);
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const inputRef = useRef<HTMLTextAreaElement>(null);

//   // ✏️ Insert markdown around selected text
//   const insertMarkdown = (before: string, after?: string) => {
//     const textarea = inputRef.current;
//     if (!textarea) return;

//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selected = textarea.value.substring(start, end);
//     const newText =
//       textarea.value.substring(0, start) +
//       before +
//       selected +
//       (after ?? before) +
//       textarea.value.substring(end);

//     onChange({ target: { value: newText } });
//     setTimeout(() => {
//       textarea.focus();
//       textarea.selectionStart = textarea.selectionEnd = start + before.length + selected.length + (after?.length ?? before.length);
//     }, 0);
//   };

//   // 📎 Handle file select
//   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !onFileUpload) return;

//     setUploading(true);
//     try {
//       const url = await onFileUpload(file);
//       addUploadedFile(file, url);
//       toast.success("File uploaded!");
//     } catch {
//       toast.error("File upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // 📋 Handle paste (copy–paste file)
//   const handlePaste = useCallback(
//     async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
//       if (!onFileUpload) return;
//       const file = e.clipboardData.files?.[0];
//       if (!file) return;

//       e.preventDefault();
//       setUploading(true);
//       try {
//         const url = await onFileUpload(file);
//         addUploadedFile(file, url);
//         toast.success("File pasted & uploaded!");
//       } catch {
//         toast.error("Paste upload failed");
//       } finally {
//         setUploading(false);
//       }
//     },
//     [value, onChange, onFileUpload]
//   );

//   // 🖱️ Handle drag–drop upload
//   const handleDrop = useCallback(
//     async (e: React.DragEvent<HTMLDivElement>) => {
//       e.preventDefault();
//       if (!onFileUpload) return;

//       const file = e.dataTransfer.files?.[0];
//       if (!file) return;

//       setUploading(true);
//       try {
//         const url = await onFileUpload(file);
//         addUploadedFile(file, url);
//         toast.success("File uploaded!");
//       } catch {
//         toast.error("Drop upload failed");
//       } finally {
//         setUploading(false);
//       }
//     },
//     [value, onChange, onFileUpload]
//   );

//   // 🔄 Add uploaded file to preview + textarea
//   const addUploadedFile = (file: File, url: string) => {
//     const fileData = { name: file.name, url };
//     setUploadedFiles((prev) => [...prev, fileData]);
//     onChange({
//       target: {
//         value: value
//           ? `${value}\n[${file.name}](${url})`
//           : `[${file.name}](${url})`,
//       },
//     });
//   };

//   // ❌ Remove file from preview
//   const removeFile = (name: string) => {
//     setUploadedFiles((prev) => prev.filter((f) => f.name !== name));
//   };

//   // 🧰 Toolbar buttons with proper markdown logic
//   const tools = [
//     { icon: <Bold size={16} />, title: "Bold", onClick: () => insertMarkdown("**") },
//     { icon: <Italic size={16} />, title: "Italic", onClick: () => insertMarkdown("*") },
//     { icon: <Underline size={16} />, title: "Underline", onClick: () => insertMarkdown("__") },
//     { icon: <Heading size={16} />, title: "Heading", onClick: () => insertMarkdown("### ", "") },
//     { icon: <List size={16} />, title: "Bullet List", onClick: () => insertMarkdown("- ", "") },
//   ];

//   return (
//     <div
//       className={`relative border rounded-xl bg-white shadow-sm p-2 flex flex-col ${className}`}
//       onDrop={handleDrop}
//       onDragOver={(e) => e.preventDefault()}
//     >
//       {/* 🧰 Toolbar */}
//       <div className="flex items-center flex-wrap gap-2 border-b border-gray-200 pb-2 mb-2 px-1">
//         {tools.map((tool, i) => (
//           <button
//             key={i}
//             onClick={tool.onClick}
//             title={tool.title}
//             className="p-1 text-gray-600 hover:text-black"
//           >
//             {tool.icon}
//           </button>
//         ))}

//         <label className="cursor-pointer p-1 text-gray-600 hover:text-black">
//           <Paperclip size={16} 
//           // title="Attach File"
//            />
//           <input
//             type="file"
//             className="hidden"
//             onChange={handleFileSelect}
//             disabled={uploading}
//           />
//         </label>

//         <Smile
//           size={16}
//           className="text-gray-600 hover:text-black cursor-pointer"
//           // title="Add emoji"
//           onClick={() => insertMarkdown("😊 ")}
//         />
//       </div>

//       {/* 📝 Text area */}
//       <textarea
//         ref={inputRef}
//         value={value}
//         onChange={onChange}
//         onBlur={onBlur}
//         onPaste={handlePaste}
//         autoFocus={autoFocus}
//         placeholder={placeholder}
//         className="w-full min-h-[120px] resize-none outline-none bg-transparent p-2 text-gray-800 font-medium"
//       />

//       {/* 🗂️ File preview container */}
//       {uploadedFiles.length > 0 && (
//         <div className="flex flex-wrap gap-2 mt-3 px-2">
//           {uploadedFiles.map((file) => (
//             <div
//               key={file.name}
//               className="flex items-center gap-2 border border-gray-300 bg-gray-50 px-3 py-1 rounded-md text-sm shadow-sm"
//             >
//               {file.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.url) ? (
//                 <img
//                   src={file.url}
//                   alt={file.name}
//                   className="w-6 h-6 rounded object-cover"
//                 />
//               ) : (
//                 <Paperclip size={14} className="text-gray-500" />
//               )}
//               <span className="truncate max-w-[120px]">{file.name}</span>
//               <button
//                 type="button"
//                 onClick={() => removeFile(file.name)}
//                 className="text-gray-400 hover:text-red-500"
//               >
//                 <X size={14} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* 📤 Footer */}
//       <div className="flex items-center justify-end mt-2 px-2">
//         <Button
//           type="button"
//           size="sm"
//           disabled={uploading}
//           className="text-sm"
//         >
//           {uploading ? "Uploading..." : <Upload size={16} />}
//         </Button>
//       </div>
//     </div>
//   );
// }









// "use client";

// import React, { useRef, useState, useCallback } from "react";
// import {
//   Bold,
//   Italic,
//   Underline,
//   List,
//   Heading,
//   Paperclip,
//   Smile,
//   Upload,
//   X,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// interface UploadedFile {
//   name: string;
//   url: string;
// }

// interface RichTextAreaProps {
//   value: string;
//   onChange: (e: { target: { value: string } }) => void;
//   onFileUpload?: (file: File) => Promise<string>;
//   onBlur?: () => void;
//   autoFocus?: boolean;
//   placeholder?: string;
//   className?: string;
// }

// export default function RichTextArea({
//   value,
//   onChange,
//   onFileUpload,
//   onBlur,
//   autoFocus = false,
//   placeholder = "Write something...",
//   className = "",
// }: RichTextAreaProps) {
//   const [uploading, setUploading] = useState(false);
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const inputRef = useRef<HTMLTextAreaElement>(null);

//   // ✏️ Insert markdown-style formatting
//   const insertMarkdown = (before: string, after?: string) => {
//     const textarea = inputRef.current;
//     if (!textarea) return;
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selected = textarea.value.substring(start, end);
//     const newText =
//       textarea.value.substring(0, start) +
//       before +
//       selected +
//       (after ?? before) +
//       textarea.value.substring(end);
//     onChange({ target: { value: newText } });
//     setTimeout(() => {
//       textarea.focus();
//       textarea.selectionStart = textarea.selectionEnd =
//         start + before.length + selected.length + (after?.length ?? before.length);
//     }, 0);
//   };

//   // 📎 Handle file select from input
//   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !onFileUpload) return;
//     await uploadFile(file);
//   };

//   // 📋 Handle paste (paste file or image)
//   const handlePaste = useCallback(
//     async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
//       if (!onFileUpload) return;
//       const file = e.clipboardData.files?.[0];
//       if (!file) return;
//       e.preventDefault();
//       await uploadFile(file);
//     },
//     [onFileUpload]
//   );

//   // 🖱️ Handle drag–drop upload
//   const handleDrop = useCallback(
//     async (e: React.DragEvent<HTMLDivElement>) => {
//       e.preventDefault();
//       if (!onFileUpload) return;
//       const file = e.dataTransfer.files?.[0];
//       if (!file) return;
//       await uploadFile(file);
//     },
//     [onFileUpload]
//   );

//   // 🔄 Upload handler
//   const uploadFile = async (file: File) => {
//     setUploading(true);
//     try {
//       const url = await onFileUpload!(file);
//       addUploadedFile(file, url);
//       toast.success(`${file.name} uploaded!`);
//     } catch (err) {
//       console.error(err);
//       toast.error("Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // ➕ Add uploaded file to preview and text
//   const addUploadedFile = (file: File, url: string) => {
//     setUploadedFiles((prev) => [...prev, { name: file.name, url }]);
//     const newValue = value
//       ? `${value}\n![${file.name}](${url})`
//       : `![${file.name}](${url})`;
//     onChange({ target: { value: newValue } });
//   };

//   // ❌ Remove file from preview
//   const removeFile = (name: string) => {
//     setUploadedFiles((prev) => prev.filter((f) => f.name !== name));
//   };

//   // 🧰 Toolbar buttons
//   const tools = [
//     { icon: <Bold size={16} />, title: "Bold", onClick: () => insertMarkdown("**") },
//     { icon: <Italic size={16} />, title: "Italic", onClick: () => insertMarkdown("*") },
//     { icon: <Underline size={16} />, title: "Underline", onClick: () => insertMarkdown("__") },
//     { icon: <Heading size={16} />, title: "Heading", onClick: () => insertMarkdown("### ", "") },
//     { icon: <List size={16} />, title: "Bullet List", onClick: () => insertMarkdown("- ", "") },
//   ];

//   return (
//     <div
//       className={`relative border rounded-xl bg-white shadow-sm p-2 flex flex-col ${className}`}
//       onDrop={handleDrop}
//       onDragOver={(e) => e.preventDefault()}
//     >
//       {/* Toolbar */}
//       <div className="flex items-center flex-wrap gap-2 border-b border-gray-200 pb-2 mb-2 px-1">
//         {tools.map((tool, i) => (
//           <button
//             key={i}
//             onClick={tool.onClick}
//             title={tool.title}
//             className="p-1 text-gray-600 hover:text-black"
//             type="button"
//           >
//             {tool.icon}
//           </button>
//         ))}

//         {/* File Upload */}
//         <label className="cursor-pointer p-1 text-gray-600 hover:text-black">
//           <Paperclip size={16} />
//           <input
//             type="file"
//             className="hidden"
//             onChange={handleFileSelect}
//             disabled={uploading}
//           />
//         </label>

//         {/* Emoji */}
//         <Smile
//           size={16}
//           className="text-gray-600 hover:text-black cursor-pointer"
//           onClick={() => insertMarkdown("😊 ")}
//         />
//       </div>

//       {/* Textarea */}
//       <textarea
//         ref={inputRef}
//         value={value}
//         onChange={onChange}
//         onBlur={onBlur}
//         onPaste={handlePaste}
//         autoFocus={autoFocus}
//         placeholder={placeholder}
//         className="w-full min-h-[120px] resize-none outline-none bg-transparent p-2 text-gray-800 font-medium"
//       />

//       {/* Uploaded file previews */}
//       {uploadedFiles.length > 0 && (
//         <div className="flex flex-wrap gap-2 mt-3 px-2">
//           {uploadedFiles.map((file) => (
//             <div
//               key={file.name}
//               className="flex items-center gap-2 border border-gray-300 bg-gray-50 px-3 py-1 rounded-md text-sm shadow-sm"
//             >
//               {file.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.url) ? (
//                 <img
//                   src={file.url}
//                   alt={file.name}
//                   className="w-6 h-6 rounded object-cover"
//                 />
//               ) : (
//                 <Paperclip size={14} className="text-gray-500" />
//               )}
//               <span className="truncate max-w-[120px]">{file.name}</span>
//               <button
//                 type="button"
//                 onClick={() => removeFile(file.name)}
//                 className="text-gray-400 hover:text-red-500"
//               >
//                 <X size={14} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Footer */}
//       <div className="flex items-center justify-end mt-2 px-2">
//         <Button
//           type="button"
//           size="sm"
//           disabled={uploading}
//           className="text-sm"
//         >
//           {uploading ? "Uploading..." : <Upload size={16} />}
//         </Button>
//       </div>
//     </div>
//   );
// }




// "use client";

// import React, { useState, useCallback } from "react";
// import { EditorContent, useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Image from "@tiptap/extension-image";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
// import {
//   Bold,
//   Italic,
//   List,
//   Image as ImageIcon,
//   Smile,
//   X,
// } from "lucide-react";

// interface UploadedImage {
//   name: string;
//   url: string;
// }

// interface RichTextEditorProps {
//   value: string;
//   onChange: (content: string) => void;
//   onFileUpload?: any;
// }

// export default function RichTextEditor({
//   value,
//   onChange,
//   onFileUpload,
// }: RichTextEditorProps) {
//   const [showEmoji, setShowEmoji] = useState(false);
//   const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
//   const [uploading, setUploading] = useState(false);
//     console.log(uploadedImages,"imagesforupload")
//   const editor = useEditor({
//     extensions: [StarterKit, Image],
//     content: value,
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     },
//     immediatelyRender: false,
//   });

//   // 📤 Handle File Upload from input
//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !onFileUpload) return;
//     await uploadImage(file);
//   };

//   // 📋 Handle Paste Image Upload
//   const handlePaste = useCallback(
//     async (e: React.ClipboardEvent<HTMLDivElement>) => {
//       if (!onFileUpload) return;
//       const file = e.clipboardData.files?.[0];
//       if (!file) return;
//       e.preventDefault();
//       await uploadImage(file);
//     },
//     [onFileUpload]
//   );

//   // 🧠 Upload Helper
//   const uploadImage = async (file: File) => {
//     try {
//       setUploading(true);
//       const url = await onFileUpload!(file);
//       editor?.chain().focus().setImage({ src: url }).run();

//       setUploadedImages((prev) => [
//         ...prev,
//         { name: file.name, url: url },
//       ]);
//     } catch (err) {
//       console.error("Upload failed", err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   // ❌ Remove from preview
//   const removeImage = (name: string) => {
//     setUploadedImages((prev) => prev.filter((img) => img.name !== name));
//   };

//   // 😊 Emoji Insert
//   const handleEmojiSelect = (emojiData: EmojiClickData) => {
//     editor?.chain().focus().insertContent(emojiData.emoji).run();
//     setShowEmoji(false);
//   };

//   return (
//     <div
//       className="border rounded-lg p-3 bg-white shadow-sm space-y-3"
//       onPaste={handlePaste}
//     >
//       {/* Toolbar */}
//       <div className="flex flex-wrap items-center gap-2 border-b pb-2">
//         <Button
//           size="sm"
//           variant="ghost"
//           onClick={() => editor?.chain().focus().toggleBold().run()}
//           className={editor?.isActive("bold") ? "bg-gray-100" : ""}
//         >
//           <Bold size={16} />
//         </Button>

//         <Button
//           size="sm"
//           variant="ghost"
//           onClick={() => editor?.chain().focus().toggleItalic().run()}
//           className={editor?.isActive("italic") ? "bg-gray-100" : ""}
//         >
//           <Italic size={16} />
//         </Button>

//         <Button
//           size="sm"
//           variant="ghost"
//           onClick={() => editor?.chain().focus().toggleBulletList().run()}
//           className={editor?.isActive("bulletList") ? "bg-gray-100" : ""}
//         >
//           <List size={16} />
//         </Button>

//         {/* Image Upload */}
//         <label className="cursor-pointer flex items-center gap-1 px-2 py-1 text-sm border rounded-md hover:bg-gray-50">
//           <ImageIcon size={16} />
//           <span className="hidden sm:inline">Image</span>
//           <input
//             type="file"
//             className="hidden"
//             onChange={handleFileUpload}
//             accept="image/*"
//           />
//         </label>

//         {/* Emoji Picker */}
//         <Popover open={showEmoji} onOpenChange={setShowEmoji}>
//           <PopoverTrigger asChild>
//             <Button size="sm" variant="ghost">
//               <Smile size={16} />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="p-0 border-none shadow-none bg-transparent">
//             <EmojiPicker
//               onEmojiClick={handleEmojiSelect}
//               searchDisabled
//               width="100%"
//             />
//           </PopoverContent>
//         </Popover>
//       </div>

//       {/* Editor Area */}
//       <div className="relative">
//         <EditorContent
//           editor={editor}
//           className="min-h-[150px] p-2 focus:outline-none prose prose-sm max-w-none"
//         />
//         {uploading && (
//           <div className="absolute top-2 right-3 text-xs text-gray-500">
//             Uploading...
//           </div>
//         )}
//       </div>

//       {/* Uploaded Image Preview */}
//       {uploadedImages.length > 0 && (
//         <div className="flex flex-wrap gap-2 border-t pt-2">
//           {uploadedImages.map((file) => (
//             <div
//               key={file.name}
//               className="relative group w-14 h-14 rounded-md overflow-hidden border"
//             >
//               <img
//                 src={file.url}
//                 alt={file.name}
//                 className="object-cover w-full h-full"
//               />
//               <button
//                 type="button"
//                 onClick={() => removeImage(file.name)}
//                 className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-[2px] opacity-0 group-hover:opacity-100 transition"
//               >
//                 <X size={12} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }







"use client";

import React, { useState, useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  Bold,
  Italic,
  List,
  Image as ImageIcon,
  Smile,
  X,
} from "lucide-react";

interface UploadedImage {
  name: string;
  // url: string;
}

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  onFileUpload?: any; // now accepts multiple files
  removeFileupload?: (file :any) => void
}

export default function RichTextEditor({
  value,
  onChange,
  onFileUpload,
  removeFileupload
}: RichTextEditorProps) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
console.log(uploadedImages,"all imagesupload")
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  // 📤 Handle File Upload (multiple)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0 || !onFileUpload) return;
    await uploadImages(files);
  };

  // 📋 Handle Paste Image Upload
  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLDivElement>) => {
      if (!onFileUpload) return;
      const file = e.clipboardData.files?.[0];
      if (!file) return;
      e.preventDefault();
      await uploadImages([file]);
    },
    [onFileUpload]
  );

  // 🧠 Upload Helper
  // const uploadImages = async (files: File[]) => {
  //   console.log(files,"filesforuploaf")
  //   try {
  //     setUploading(true);
  //     const urls = await onFileUpload!(files);

  //     // insert all into editor
  //     urls.forEach((url: string) => {
  //       editor?.chain().focus().setImage({ src: url }).run();
  //     });

  //     // store names + urls
  //     setUploadedImages((prev) => [
  //       ...prev,
  //       ...files.map((file, i) => ({
  //         name: file.name,
          
  //       })),
  //     ]);
  //   } catch (err) {
  //     console.error("Upload failed", err);
  //   } finally {
  //     setUploading(false);
  //   }
  // };
  const uploadImages =  (files: File[]) => {
  try {
    setUploading(true);

    const urls =  onFileUpload(files);

    // Update editor with all images
    // urls.forEach((url: string) => {
    //   editor?.chain().focus().setImage({ src: url }).run();
    // });

    // ✅ Always use functional update form
    setUploadedImages((prev) => {
      const updated = [
        ...prev,
        ...files.map((file) => ({
          name: file.name,
        })),
      ];
      console.log("✅ Updated uploadedImages:", updated);
      return updated;
    });
  } catch (err) {
    console.error("❌ Upload failed", err);
  } finally {
    setUploading(false);
  }
};


  // ❌ Remove from preview list
const removeImage = (name: string) => {
  setUploadedImages((prev) => {
    const matched = prev.filter((img) => img.name === name); 
  if (removeFileupload) {
      removeFileupload(matched); 
    }    return prev.filter((img) => img.name !== name); 
  });
};

  // 😊 Emoji Insert
  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    editor?.chain().focus().insertContent(emojiData.emoji).run();
    setShowEmoji(false);
  };

  return (
    <div
      className="border rounded-lg p-3 bg-white shadow-sm space-y-3"
      onPaste={handlePaste}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive("bold") ? "bg-gray-100" : ""}
        >
          <Bold size={16} />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive("italic") ? "bg-gray-100" : ""}
        >
          <Italic size={16} />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive("bulletList") ? "bg-gray-100" : ""}
        >
          <List size={16} />
        </Button>

        {/* Image Upload */}
        <label className="cursor-pointer flex items-center gap-1 px-2 py-1 text-sm border rounded-md hover:bg-gray-50">
          <ImageIcon size={16} />
          <span className="hidden sm:inline">Upload</span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*"
          />
        </label>

        {/* Emoji Picker */}
        {/* <Popover open={showEmoji} onOpenChange={setShowEmoji}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="ghost">
              <Smile size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 border-none shadow-none bg-transparent">
            <EmojiPicker onEmojiClick={handleEmojiSelect} searchDisabled width="100%" />
          </PopoverContent>
        </Popover> */}
                 {/* ✅ Emoji Picker */}
        {/* <Popover open={showEmoji} onOpenChange={setShowEmoji}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="ghost">
              <Smile size={16} />
            </Button>
          </PopoverTrigger>
        
          <PopoverContent
            className="p-0 border-none shadow-none bg-transparent"
            onClick={(e) => e.stopPropagation()} // Prevent popover from closing early
          >
            <EmojiPicker
              searchDisabled
              width={300}
              height={400}
              onEmojiClick={(emojiData, event) => {
                event.stopPropagation(); // ⛔ prevent closing popover
                editor?.chain().focus().insertContent(emojiData.emoji).run(); // ✅ insert
              }}
            />
          </PopoverContent>
        </Popover> */}
        
      </div>

      {/* Editor Area */}
      <div className="relative">
        <EditorContent
          editor={editor}
          className="min-h-[150px] p-2 focus:outline-none prose prose-sm max-w-none"
        />
        {uploading && (
          <div className="absolute top-2 right-3 text-xs text-gray-500">
            Uploading...
          </div>
        )}
      </div>

      {/* Uploaded Images List */}
      {uploadedImages.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t pt-2">
          {uploadedImages.map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
            >
              <span className="truncate max-w-[100px]" title={file.name}>
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => removeImage(file.name)}
                className="text-gray-500 hover:text-red-500"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

