'use strict';

(function() {
	// Trivia Controller Spec
	describe('Trivia Controller Tests', function() {
		// Initialize global variables
		var TriviaController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Trivia controller.
			TriviaController = $controller('TriviaController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Trivium object fetched from XHR', inject(function(Trivia) {
			// Create sample Trivium using the Trivia service
			var sampleTrivium = new Trivia({
				name: 'New Trivium'
			});

			// Create a sample Trivia array that includes the new Trivium
			var sampleTrivia = [sampleTrivium];

			// Set GET response
			$httpBackend.expectGET('trivia').respond(sampleTrivia);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.trivia).toEqualData(sampleTrivia);
		}));

		it('$scope.findOne() should create an array with one Trivium object fetched from XHR using a triviumId URL parameter', inject(function(Trivia) {
			// Define a sample Trivium object
			var sampleTrivium = new Trivia({
				name: 'New Trivium'
			});

			// Set the URL parameter
			$stateParams.triviumId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/trivia\/([0-9a-fA-F]{24})$/).respond(sampleTrivium);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.trivium).toEqualData(sampleTrivium);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Trivia) {
			// Create a sample Trivium object
			var sampleTriviumPostData = new Trivia({
				name: 'New Trivium'
			});

			// Create a sample Trivium response
			var sampleTriviumResponse = new Trivia({
				_id: '525cf20451979dea2c000001',
				name: 'New Trivium'
			});

			// Fixture mock form input values
			scope.name = 'New Trivium';

			// Set POST response
			$httpBackend.expectPOST('trivia', sampleTriviumPostData).respond(sampleTriviumResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Trivium was created
			expect($location.path()).toBe('/trivia/' + sampleTriviumResponse._id);
		}));

		it('$scope.update() should update a valid Trivium', inject(function(Trivia) {
			// Define a sample Trivium put data
			var sampleTriviumPutData = new Trivia({
				_id: '525cf20451979dea2c000001',
				name: 'New Trivium'
			});

			// Mock Trivium in scope
			scope.trivium = sampleTriviumPutData;

			// Set PUT response
			$httpBackend.expectPUT(/trivia\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/trivia/' + sampleTriviumPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid triviumId and remove the Trivium from the scope', inject(function(Trivia) {
			// Create new Trivium object
			var sampleTrivium = new Trivia({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Trivia array and include the Trivium
			scope.trivia = [sampleTrivium];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/trivia\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTrivium);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.trivia.length).toBe(0);
		}));
	});
}());