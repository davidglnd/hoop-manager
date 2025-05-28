// @ts-check

/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testEnvironment: 'jsdom',
  injectGlobals: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^classes/(.*)': '<rootDir>/src/js/classes/$1.js',
    '^decorators/(.*)': '<rootDir>/src/js/decorators/$1.js',
    '^utils/(.*)': '<rootDir>/src/js/utils/$1.js',
    '^lib/(.*)': '<rootDir>/src/js/lib/$1.js',
    '^store/(.*)': '<rootDir>/src/js/store/$1.js',
    'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js': '<rootDir>/src/js/lib/lit-all.min.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
  fakeTimers: {
    enableGlobally: true,
  },
}

export default config