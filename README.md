# Dynamic tree structure 

This application provides a dynamic tree view structure with various functionalities such as fetching leaf data, highlighting nodes, and handling drag-and-drop operations. The application consists of a header and a tree view component.

Deployed version can be seen [here](https://dynamic-tree-structure.netlify.app/)

## What's inside?

- [Quick start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Reasoning](#reasoning)
- [Testing](#testing)
- [Future improvements](#future-improvements)


## Quick start
To set up the repository initially and get a baseline working, follow these steps:

1. Clone the repository
```bash
$ git clone git@github.com:MilaRCDias/dynamic-tree-structure.git

$ cd dynamic-tree-structure
```

2. Install all package dependencies using yarn

run command:

```bash
$ yarn
```

3. Create a `.env.local` file and add the API url variables values, see `.env.example` for the variables names.


4. To run it in development mode:


```bash
$ yarn start
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


## Project folder structure
```bash
├── src/               
│   ├── components/             # React components
│   ├── store/                  # Zustand store 
│   ├── DnD/                    # Drag-and-drop specific context
│   ├── helpers/                # Helper functions
│   ├── App.tsx                 # Main App component
│   ├── index.tsx               # Entry point for the React application
│   └── styles/                  # Scss variables and global styles
```


## Architecture Overview

The project architecture was designed to prioritize scalability, maintainability, and developer efficiency. It uses Zustand for state management, ensuring a lightweight yet powerful way to handle the application's complex data structure while maintaining simplicity and flexibility. The drag-and-drop functionality leverages @atlaskit/pragmatic-drag-and-drop, chosen for its developer-friendly API and granular control, allowing custom implementation. The component-based architecture, ensures reusability and modularity. Overall, the architecture emphasizes clean separation of concerns, enabling seamless feature expansion.


## Reasoning

### State managing

Zustand is a small, fast, and scalable state management solution for React applications. It was choosing due to its simplicity, minimal boilerplate, and it enables components to subscribe to state parts without unnecessary re-renders. And last but not least it has flexibility for future requirements and scalability.
This store handles various aspects of the tree view state, including loading state, error handling, fetching and setting tree data, and managing highlighted nodes.

The store manages the following state properties:

`treeData`: An array representing the tree structure.
`loading`: Boolean indicating whether data is being loaded.
`error`: Error message for tree data fetching.
`leafData`: Data for the currently selected leaf node.
`leafError`: Error message for leaf data fetching.
`leafCache`: A cache for leaf data.
`lastAction`: The last action performed on the tree.
`highlightedNodes`: A set of highlighted node IDs.



### Drag and Drop

The following criteria was used to choose a external library: 
- core functionality that meets the project requirement
- actively maintained
- good documentation 
- community to support 
- customization for scalability needs

After a short research on external library packages with drag and drop functionalities for a tree structure, like: "react-arborist", "react-dnd-treeview" and "react-sortable-tree", the "Pragmatic Drag and Drop" was choosed.

The Pragmatic Drag and Drop library offers a developer-friendly API that provides the necessary tools or essential building blocks for a drag and drop experience, it only requires to write the implementation as you need. This decision was also made with the idea of an implementation that could be scalable in a large project with other furute features to be added.   
Pragmatic Drag and Drop allows developers to directly build and write the functionality to suit the specific needs, avoiding the need for extensive workarounds or additional helper functions. This flexibility made it the ideal choice for creating a tailored drag-and-drop solution.


### Add theming

A hook `useTheme` was created to toggle the theme mode from light to dark, and saving the mode option to the localstorage to the theme remains when the page is refreshed. 
The implementation as a React hook was made for simplicity of the project not adding unnecessary complexity.


## Testing

It employs Jest and React Testing Library for unit and integration testing, targeting both core functionalities and UI components. Mocking tools like faker simulate realistic scenarios, while coverage includes edge cases, error handling, and user interactions. 



## Future improvements

Here are the parts that can be improved

1. Empty state and loading and error UI components
1. Include zod for data schema validation
1. Improve when node is leaf to fetch data without unhighlighting it
1. Add 100% coverage test
1. Add E2E test
