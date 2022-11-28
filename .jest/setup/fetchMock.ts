const fetchMock = jest.fn();
global.fetch = fetchMock;

export { fetchMock };
