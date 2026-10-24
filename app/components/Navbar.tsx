import Link from "next/link";

export default function Navbar() {
    return <div className="flex flex-row gap-3">
        <Link href={"/"}>Home</Link>
        <Link href={"/teams"}>Teams</Link>
    </div>
}