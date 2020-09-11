package main_test

import (
	sut "github.com/Thrillberg/imperial/server"
	"testing"
)

func TestValidate(t *testing.T) {
	t.Run("empty Data with empty keys", func(t *testing.T) {
		d := sut.Data{}
		err := d.Validate()
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
	})
	t.Run("empty Data with an expected key", func(t *testing.T) {
		d := sut.Data{}
		err := d.Validate("theAnswer")
		if err == nil {
			t.Fatalf("wanted an error: %s", err)
		}
	})
	t.Run("present Data with empty keys", func(t *testing.T) {
		d := sut.Data{"theAnswer": "42"}
		err := d.Validate()
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
	})
	t.Run("present Data with an expected key", func(t *testing.T) {
		d := sut.Data{"theAnswer": "42"}
		err := d.Validate("theAnswer")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
	})
	t.Run("present Data with a missing key", func(t *testing.T) {
		d := sut.Data{"theAnswer": "42"}
		err := d.Validate("theAnswer", "theWrongAnswer")
		if err == nil {
			t.Fatalf("wanted an error: %s", err)
		}
	})
}
