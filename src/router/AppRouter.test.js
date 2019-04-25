import React from "react";

import { mount } from "enzyme";
import { MemoryRouter } from "react-router";

import Root from "Root";
import AppRoutes from "./AppRoutes";
import Login from "pages/Login/Login";
import NotFound from "pages/NotFound/NotFound";
import CMS from "pages/CMS/CMS";

it("should redirect to 404 on invalid path", () => {
  const wrapper = mount(
    <Root>
      <MemoryRouter initialEntries={["/random"]}>
        <AppRoutes />
      </MemoryRouter>
    </Root>
  );
  expect(wrapper.find(Login)).toHaveLength(0);
  expect(wrapper.find(NotFound)).toHaveLength(1);
});

it("should not redirect to 404 on invalid path", () => {
  const wrapper = mount(
    <Root>
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    </Root>
  );
  expect(wrapper.find(Login)).toHaveLength(1);
  expect(wrapper.find(NotFound)).toHaveLength(0);
});

it("should redirect to CMS when isAuthenticated is true", () => {
  const initialState = {
    auth: {
      user: {
        isAuthenticated: true
      }
    }
  };
  const wrapper = mount(
    <Root initialState={initialState}>
      <MemoryRouter initialEntries={["/cms/rehab"]}>
        <AppRoutes />
      </MemoryRouter>
    </Root>
  );
  expect(wrapper.find(CMS)).toHaveLength(1);
  expect(wrapper.find(NotFound)).toHaveLength(0);
});
