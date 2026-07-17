import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute()({
  head: () => ({ meta: [{ title: "Admin — Users — DavaNav" }] }),
  component: UsersPage,
});

function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="mt-4">Manage admin users and roles.</p>
      <div className="mt-6">
        <Link to="/admin">← Back to dashboard</Link>
      </div>
    </div>
  );
}

export default UsersPage;
