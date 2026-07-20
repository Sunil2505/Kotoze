interface RecentUser {
  _id: string;
  fullName: string;
  email?: string;
  mobile: string;
  createdAt: string;
}

interface RecentUsersProps {
  users: RecentUser[];
}

export default function RecentUsers({
  users,
}: RecentUsersProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Recent Users
        </h3>

        <span className="text-sm text-muted-foreground">
          {users.length} User{users.length !== 1 ? "s" : ""}
        </span>
      </div>

      {users.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No users found.
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-semibold">
                  {user.fullName}
                </p>

                <p className="text-sm text-muted-foreground">
                  {user.mobile}
                </p>

                {user.email && (
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>

              <div className="text-right text-xs text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}