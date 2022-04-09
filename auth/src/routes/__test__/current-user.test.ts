import request from "supertest";
import { app } from "../../app";
import { ErrorResponse } from "../../commons/responses/error";
import { signIn } from "../../test/auth-helper";

it("returns a 401 when user is not signed in", async () => {
  const res = await request(app).get("/api/users/currentuser");

  expect(res.status).toBe(401);
  expect(res.body).toMatchObject<ErrorResponse>({
    errors: [
      {
        message: "Unauthorized",
      },
    ],
  });
});

it("returns a 200 when succesfully returns current user", async () => {
  const { user, cookies } = await signIn();

  const res = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookies);

  expect(res.status).toBe(200);
  const { currentUser } = res.body;
  expect(currentUser.id).toBe(user.id);
  expect(currentUser.email).toBe("test@test.com");
});
